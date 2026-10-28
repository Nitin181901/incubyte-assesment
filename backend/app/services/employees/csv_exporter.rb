require "csv"

module Employees
  # Builds a CSV Enumerator (header + batched rows) for streaming via response_body.
  # We avoid ActionController::Live: Rails iterates the Enumerator and writes chunks.
  class CsvExporter
    HEADERS = %w[
      first_name last_name email country_code department job_title salary hired_on
    ].freeze

    BATCH_SIZE = 1_000

    def initialize(scope)
      @scope = scope
    end

    def enum
      Enumerator.new do |yielder|
        yielder << CSV.generate_line(HEADERS)

        # Preserve custom sort: pluck ids in order, then reload batches with includes.
        ids = @scope.except(:includes).pluck(:id)
        ids.each_slice(BATCH_SIZE) do |id_batch|
          by_id = Employee.includes(:country).where(id: id_batch).index_by(&:id)
          id_batch.each do |id|
            employee = by_id[id]
            next unless employee

            yielder << CSV.generate_line(row_for(employee))
          end
        end
      end
    end

    def self.sanitize(value)
      str = value.nil? ? "" : value.to_s
      str.match?(/\A[=+\-@]/) ? "'#{str}" : str
    end

    private

    def row_for(employee)
      [
        self.class.sanitize(employee.first_name),
        self.class.sanitize(employee.last_name),
        self.class.sanitize(employee.email),
        self.class.sanitize(employee.country&.code),
        self.class.sanitize(employee.department),
        self.class.sanitize(employee.job_title),
        self.class.sanitize(employee.salary),
        self.class.sanitize(employee.hired_on&.iso8601)
      ]
    end
  end
end
