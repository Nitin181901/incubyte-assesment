module Stats
  class Breakdown
    ALLOWED = %i[country department job_title].freeze

    def initialize(by:)
      @by = by.to_sym
      raise ArgumentError, "by must be one of #{ALLOWED.join(', ')}" unless ALLOWED.include?(@by)
    end

    def call(scope = Employee.all)
      case @by
      when :country then by_country(scope)
      when :department then by_attribute(scope, :department)
      when :job_title then by_attribute(scope, :job_title)
      end
    end

    private

    def by_attribute(scope, attribute)
      # One pluck; group/sort/percentiles in Ruby.
      rows = scope.pluck(attribute, :salary_usd)
      grouped = rows.group_by(&:first).transform_values { |pairs| pairs.map { |(_, salary)| salary.to_d }.sort }

      grouped.map { |key, values| row_for(key, values) }
             .sort_by { |row| [ -row[:headcount], row[:key].to_s ] }
    end

    def by_country(scope)
      rows = scope.joins(:country).pluck("countries.code", "countries.name", "employees.salary_usd")
      grouped = rows.group_by { |code, name, _| [ code, name ] }
                    .transform_values { |triples| triples.map { |(_, _, salary)| salary.to_d }.sort }

      grouped.map { |(code, name), values| row_for({ code: code, name: name }, values) }
             .sort_by { |row| [ -row[:headcount], row[:key][:code] ] }
    end

    def row_for(key, values)
      {
        key: key,
        headcount: values.size,
        avg: values.sum / values.size,
        median: Percentile.call(values, 0.5),
        p25: Percentile.call(values, 0.25),
        p75: Percentile.call(values, 0.75),
        p90: Percentile.call(values, 0.90)
      }
    end
  end
end
