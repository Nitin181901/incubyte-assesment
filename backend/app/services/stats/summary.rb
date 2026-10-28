module Stats
  class Summary
    def self.call(scope = Employee.all)
      new(scope).call
    end

    def initialize(scope = Employee.all)
      @scope = scope
    end

    def call
      # One pluck; aggregate in Ruby for SQLite/Postgres parity.
      values = @scope.pluck(:salary_usd).map { |v| v.to_d }.sort
      return zero_result if values.empty?

      total = values.sum
      {
        headcount: values.size,
        total_payroll_usd: total,
        avg: total / values.size,
        median: Percentile.call(values, 0.5),
        min: values.first,
        max: values.last
      }
    end

    private

    def zero_result
      {
        headcount: 0,
        total_payroll_usd: 0,
        avg: nil,
        median: nil,
        min: nil,
        max: nil
      }
    end
  end
end
