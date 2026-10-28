require "csv"

module Employees
  class CsvImporter
    class Error < StandardError; end

    REQUIRED_HEADERS = %w[
      first_name last_name email country_code department job_title salary hired_on
    ].freeze
    MAX_BYTES = 5 * 1024 * 1024
    MAX_ROWS = 10_000
    MAX_ERRORS = 100
    BATCH_SIZE = 200

    def initialize(file:, dry_run: false, changed_by: nil)
      @file = file
      @dry_run = dry_run
      @changed_by = changed_by
    end

    def call
      validate_file!
      rows = parse_rows!
      raise Error, "CSV has more than #{MAX_ROWS} data rows" if rows.size > MAX_ROWS

      countries = Country.all.index_by { |c| c.code.upcase }
      summary = { created: 0, updated: 0, unchanged: 0, failed: 0, errors: [] }

      process = lambda do
        rows.each_slice(BATCH_SIZE) do |batch|
          emails = batch.map { |(_n, row)| row["email"].to_s.strip.downcase }.uniq
          existing = Employee.includes(:country).where(email: emails).index_by(&:email)

          batch.each do |row_number, row|
            process_row(row_number, row, countries, existing, summary)
          end
        end
      end

      if @dry_run
        process.call
      else
        ActiveRecord::Base.transaction { process.call }
      end

      summary
    end

    private

    def validate_file!
      raise Error, "file is required" if @file.blank?
      raise Error, "file is empty" if @file.size.to_i <= 0
      raise Error, "file exceeds 5 MB limit" if @file.size.to_i > MAX_BYTES
    end

    def parse_rows!
      table = CSV.parse(@file.read, headers: true, return_headers: false)
      raise Error, "file is empty" if table.nil?

      headers = table.headers&.compact&.map { |h| h.to_s.strip.downcase }
      raise Error, "missing CSV header row" if headers.blank?

      missing = REQUIRED_HEADERS - headers
      raise Error, "missing required headers: #{missing.join(', ')}" if missing.any?

      rows = []
      table.each_with_index do |row, index|
        next if row.to_h.values.all?(&:blank?)

        normalized = REQUIRED_HEADERS.index_with { |key| row[key].to_s.strip }
        rows << [ index + 2, normalized ] # +2: header is row 1
      end
      rows
    rescue CSV::MalformedCSVError => e
      raise Error, "invalid CSV: #{e.message}"
    end

    def process_row(row_number, row, countries, existing, summary)
      messages = validate_row(row, countries)
      if messages.any?
        record_failure(summary, row_number, row["email"], messages)
        return
      end

      email = row["email"].downcase
      country = countries[row["country_code"].upcase]
      attrs = {
        first_name: row["first_name"],
        last_name: row["last_name"],
        email: email,
        country: country,
        department: row["department"],
        job_title: row["job_title"],
        salary: BigDecimal(row["salary"]),
        hired_on: Date.parse(row["hired_on"])
      }

      employee = existing[email]
      if employee.nil?
        create_employee(attrs, existing, summary, row_number)
      else
        update_employee(employee, attrs, summary, row_number)
      end
    rescue StandardError => e
      record_failure(summary, row_number, row["email"], [ e.message ])
    end

    def validate_row(row, countries)
      messages = []
      messages << "first_name can't be blank" if row["first_name"].blank?
      messages << "last_name can't be blank" if row["last_name"].blank?
      messages << "email is invalid" if row["email"].blank? || row["email"] !~ URI::MailTo::EMAIL_REGEXP
      messages << "country_code is unknown" if countries[row["country_code"].to_s.upcase].nil?
      messages << "department can't be blank" if row["department"].blank?
      messages << "job_title can't be blank" if row["job_title"].blank?

      salary = begin
        BigDecimal(row["salary"])
      rescue ArgumentError
        nil
      end
      messages << "salary must be greater than 0" if salary.nil? || salary <= 0

      begin
        Date.parse(row["hired_on"])
      rescue ArgumentError, TypeError
        messages << "hired_on is invalid"
      end

      messages
    end

    def create_employee(attrs, existing, summary, row_number)
      if @dry_run
        summary[:created] += 1
        return
      end

      employee = Employee.new(attrs)
      employee.changed_by = @changed_by
      employee.reason = "CSV import"
      if employee.save
        existing[employee.email] = employee
        summary[:created] += 1
      else
        record_failure(summary, row_number, attrs[:email], employee.errors.full_messages)
      end
    end

    def update_employee(employee, attrs, summary, row_number)
      changes = {}
      %i[first_name last_name department job_title hired_on].each do |key|
        changes[key] = attrs[key] if employee.public_send(key) != attrs[key]
      end
      changes[:country] = attrs[:country] if employee.country_id != attrs[:country].id
      salary_changed = employee.salary.to_d != attrs[:salary].to_d
      changes[:salary] = attrs[:salary] if salary_changed

      if changes.empty?
        summary[:unchanged] += 1
        return
      end

      if @dry_run
        summary[:updated] += 1
        return
      end

      employee.assign_attributes(changes)
      if salary_changed
        employee.changed_by = @changed_by
        employee.reason = "CSV import"
      end

      if employee.save
        summary[:updated] += 1
      else
        record_failure(summary, row_number, employee.email, employee.errors.full_messages)
      end
    end

    def record_failure(summary, row_number, email, messages)
      summary[:failed] += 1
      return if summary[:errors].size >= MAX_ERRORS

      summary[:errors] << { row: row_number, email: email.to_s, messages: Array(messages) }
    end
  end
end
