module Stats
  class Distribution
    def initialize(bins: 20)
      @bins = bins.to_i
      raise ArgumentError, "bins must be >= 1" if @bins < 1
    end

    def call(scope = Employee.all)
      # One pluck; bin in Ruby for engine parity.
      values = scope.pluck(:salary_usd).map { |v| v.to_d }
      return [] if values.empty?

      min = values.min
      max = values.max

      if min == max
        return [ { from: min, to: max, count: values.size } ]
      end

      width = (max - min) / @bins
      counts = Array.new(@bins, 0)

      values.each do |value|
        if value == max
          counts[@bins - 1] += 1
        else
          index = ((value - min) / width).floor
          index = [[ index, 0 ].max, @bins - 1 ].min
          counts[index] += 1
        end
      end

      Array.new(@bins) do |i|
        from = min + width * i
        to = (i == @bins - 1) ? max : (min + width * (i + 1))
        { from: from, to: to, count: counts[i] }
      end
    end
  end
end
