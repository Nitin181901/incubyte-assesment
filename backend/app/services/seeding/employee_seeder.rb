module Seeding
  class EmployeeSeeder
    # Illustrative rates: 1 unit of local currency = usd_rate USD (not live FX).
    COUNTRIES = [
      { code: "IN", name: "India", currency_code: "INR", usd_rate: "0.012000" },
      { code: "US", name: "United States", currency_code: "USD", usd_rate: "1.000000" },
      { code: "GB", name: "United Kingdom", currency_code: "GBP", usd_rate: "1.270000" },
      { code: "DE", name: "Germany", currency_code: "EUR", usd_rate: "1.080000" },
      { code: "SG", name: "Singapore", currency_code: "SGD", usd_rate: "0.740000" },
      { code: "AU", name: "Australia", currency_code: "AUD", usd_rate: "0.650000" },
      { code: "CA", name: "Canada", currency_code: "CAD", usd_rate: "0.730000" },
      { code: "BR", name: "Brazil", currency_code: "BRL", usd_rate: "0.180000" }
    ].freeze

    # Relative labor-cost multipliers applied to title base (USD-equivalent).
    COST_FACTOR = {
      "US" => 1.00,
      "GB" => 0.95,
      "DE" => 0.90,
      "AU" => 0.92,
      "CA" => 0.88,
      "SG" => 0.85,
      "IN" => 0.35,
      "BR" => 0.45
    }.freeze

    # Weighted country draw — India and US dominate headcount.
    COUNTRY_WEIGHTS = {
      "IN" => 35,
      "US" => 25,
      "GB" => 8,
      "DE" => 8,
      "CA" => 7,
      "SG" => 6,
      "AU" => 6,
      "BR" => 5
    }.freeze

    DEPARTMENTS = {
      "Engineering" => [
        [ "Software Engineer I", 70_000 ],
        [ "Software Engineer II", 90_000 ],
        [ "Senior Software Engineer", 120_000 ],
        [ "Staff Engineer", 160_000 ]
      ],
      "Sales" => [
        [ "Sales Executive", 55_000 ],
        [ "Account Manager", 75_000 ],
        [ "Senior Account Manager", 95_000 ],
        [ "Sales Director", 140_000 ]
      ],
      "Marketing" => [
        [ "Marketing Coordinator", 50_000 ],
        [ "Marketing Specialist", 65_000 ],
        [ "Marketing Manager", 95_000 ],
        [ "Marketing Director", 130_000 ]
      ],
      "HR" => [
        [ "HR Coordinator", 48_000 ],
        [ "HR Specialist", 62_000 ],
        [ "HR Manager", 90_000 ],
        [ "HR Director", 125_000 ]
      ],
      "Finance" => [
        [ "Financial Analyst", 65_000 ],
        [ "Senior Financial Analyst", 85_000 ],
        [ "Finance Manager", 110_000 ],
        [ "Finance Director", 145_000 ]
      ],
      "Operations" => [
        [ "Operations Coordinator", 50_000 ],
        [ "Operations Specialist", 68_000 ],
        [ "Operations Manager", 100_000 ],
        [ "Operations Director", 135_000 ]
      ],
      "Support" => [
        [ "Support Specialist", 45_000 ],
        [ "Support Engineer", 60_000 ],
        [ "Senior Support Engineer", 80_000 ],
        [ "Support Manager", 105_000 ]
      ],
      "Product" => [
        [ "Product Analyst", 70_000 ],
        [ "Product Manager", 110_000 ],
        [ "Senior Product Manager", 140_000 ],
        [ "Director of Product", 170_000 ]
      ]
    }.freeze

    LOCAL_STEP = {
      "USD" => 100,
      "GBP" => 50,
      "EUR" => 50,
      "SGD" => 50,
      "AUD" => 50,
      "CAD" => 50,
      "INR" => 1_000,
      "BRL" => 100
    }.freeze

    BATCH_SIZE = 1_000
    DEMO_EMAIL = "demo@acme.test".freeze

    attr_reader :count, :outlier_count, :random

    def initialize(count: 10_000, outlier_count: 40, random: Random.new(42))
      @count = count
      @outlier_count = outlier_count
      @random = random
    end

    def call
      started = Process.clock_gettime(Process::CLOCK_MONOTONIC)

      seed_countries!
      seed_demo_user!

      if Employee.exists?
        if ENV["RESEED"] == "1"
          puts "RESEED=1: clearing employees and salary_changes..."
          SalaryChange.delete_all
          Employee.delete_all
        else
          puts "Employees already present (#{Employee.count}); skip employee seed (RESEED=1 to rebuild)."
          print_elapsed(started)
          return summary
        end
      end

      seed_employees!

      print_elapsed(started)
      summary
    end

    private

    def summary
      {
        countries: Country.count,
        users: User.count,
        employees: Employee.count,
        salary_changes: SalaryChange.count
      }
    end

    def print_elapsed(started)
      elapsed = Process.clock_gettime(Process::CLOCK_MONOTONIC) - started
      puts format("Seeding finished in %.3fs (countries=%d employees=%d salary_changes=%d)",
                  elapsed, Country.count, Employee.count, SalaryChange.count)
    end

    def seed_countries!
      COUNTRIES.each do |attrs|
        country = Country.find_or_initialize_by(code: attrs[:code])
        country.assign_attributes(attrs)
        country.save!
      end
      @countries_by_code = Country.all.index_by(&:code)
    end

    def seed_demo_user!
      User.find_or_create_by!(email: DEMO_EMAIL) do |user|
        user.name = "HR Manager"
        user.password = "Password123!"
      end
    end

    def seed_employees!
      department_names = DEPARTMENTS.keys
      weighted_codes = COUNTRY_WEIGHTS.flat_map { |code, weight| [ code ] * weight }
      now = Time.current
      today = Date.current
      span_days = 12 * 365

      rows = Array.new(count) do |index|
        code = weighted_codes[random.rand(weighted_codes.size)]
        country = @countries_by_code.fetch(code)
        department = department_names[random.rand(department_names.size)]
        title, base_usd = DEPARTMENTS.fetch(department)[random.rand(DEPARTMENTS.fetch(department).size)]
        first_name, last_name = NamePools.pick(code, random)

        salary_usd = base_usd * COST_FACTOR.fetch(code) * noise_factor
        salary, salary_usd = localize_salary(salary_usd, country)

        # Bias hired_on toward recent years: square a uniform draw over 12 years.
        hired_on = today - (random.rand**2 * span_days).round

        email_local = "#{slug(first_name)}.#{slug(last_name)}.#{index + 1}"
        {
          first_name: first_name,
          last_name: last_name,
          email: "#{email_local}@acme.test",
          country_id: country.id,
          department: department,
          job_title: title,
          salary: salary,
          salary_usd: salary_usd,
          hired_on: hired_on,
          currency_code: country.currency_code, # stripped before insert
          created_at: now,
          updated_at: now
        }
      end

      apply_outliers!(rows)

      ActiveRecord::Base.transaction do
        inserted_ids = []
        change_rows = []

        rows.each_slice(BATCH_SIZE) do |batch|
          insertable = batch.map { |row| row.except(:currency_code) }
          result = Employee.insert_all(insertable, returning: %w[id])
          ids = result.rows.map { |row| row[0] }
          inserted_ids.concat(ids)

          batch.each_with_index do |row, i|
            change_rows << {
              employee_id: ids[i],
              old_salary: nil,
              new_salary: row[:salary],
              currency_code: row[:currency_code],
              reason: "Initial salary",
              changed_by_id: nil,
              created_at: now
            }
          end
        end

        change_rows.each_slice(BATCH_SIZE) do |batch|
          SalaryChange.insert_all(batch)
        end

        raise "inserted #{inserted_ids.size} employees, expected #{count}" if inserted_ids.size != count
      end
    end

      def apply_outliers!(rows)
      return if outlier_count <= 0 || rows.empty?

      # Prefer title+country cohorts so dashboard outlier detection has clear peers.
      grouped_indices = rows.each_with_index.group_by { |row, _i| [ row[:job_title], row[:country_id] ] }
      eligible = grouped_indices.values.select { |pairs| pairs.size >= 5 }.map { |pairs| pairs.map(&:last) }.flatten
      pool = eligible.presence || (0...rows.size).to_a
      n = [ outlier_count, pool.size ].min
      chosen = pool.sample(n, random: random)

      chosen.each_with_index do |idx, i|
        row = rows[idx]
        country = @countries_by_code.values.find { |c| c.id == row[:country_id] }
        multiplier = i.even? ? 2.6 : 0.38
        target_usd = BigDecimal(row[:salary_usd].to_s) * multiplier
        salary, salary_usd = localize_salary(target_usd, country)
        row[:salary] = salary
        row[:salary_usd] = salary_usd
      end
    end

    def localize_salary(salary_usd, country)
      rate = BigDecimal(country.usd_rate.to_s)
      step = LOCAL_STEP.fetch(country.currency_code, 50)
      local = BigDecimal(salary_usd.to_s) / rate
      rounded_local = ((local / step).round * step).to_d.round(2)
      rounded_local = step.to_d if rounded_local <= 0
      recomputed_usd = (rounded_local * rate).round(2)
      [ rounded_local, recomputed_usd ]
    end

    def noise_factor
      # Box–Muller normal noise, clamped to roughly +/-15%.
      u1 = [ random.rand, 1e-12 ].max
      u2 = random.rand
      z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math::PI * u2)
      (1.0 + z * 0.05).clamp(0.85, 1.15)
    end

    def slug(name)
      name.to_s.downcase.gsub(/[^a-z0-9]+/, "")
    end
  end
end
