module Stats
  class TenureBands
    BANDS = [
      [ "0-2", 0.0, 2.0 ],
      [ "2-5", 2.0, 5.0 ],
      [ "5+", 5.0, nil ]
    ].freeze

    def self.call(scope = Employee.all, as_of: Date.current)
      new(as_of: as_of).call(scope)
    end

    def initialize(as_of: Date.current)
      @as_of = as_of
    end

    def call(scope = Employee.all)
      # One pluck; band + median in Ruby (deterministic with as_of:).
      rows = scope.pluck(:hired_on, :salary_usd)
      buckets = Hash.new { |h, k| h[k] = [] }

      rows.each do |hired_on, salary_usd|
        years = tenure_years(hired_on)
        next if years.negative?

        band = band_for(years)
        buckets[band] << salary_usd.to_d if band
      end

      BANDS.map do |label, _min, _max|
        values = buckets[label].sort
        {
          band: label,
          headcount: values.size,
          median: Percentile.call(values, 0.5)
        }
      end
    end

    private

    def tenure_years(hired_on)
      return -1.0 if hired_on.blank? || @as_of < hired_on

      (@as_of - hired_on).to_f / 365.25
    end

    def band_for(years)
      return "0-2" if years >= 0 && years < 2
      return "2-5" if years >= 2 && years < 5
      return "5+" if years >= 5

      nil
    end
  end
end
