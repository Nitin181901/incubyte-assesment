module Stats
  module Percentile
    module_function

    # Linear interpolation between closest ranks — same method as NumPy's default
    # percentile (method="linear") and Excel PERCENTILE.INC.
    #
    # +p+ is in [0, 1] (so the median is p=0.5 / "p50"). For a sorted sample of
    # size n, the index is i = p * (n - 1). If i is not an integer, the result is
    # a[lo] + (a[hi] - a[lo]) * (i - lo) where lo = floor(i) and hi = ceil(i).
    # Returns nil for an empty array.
    def call(sorted_values, p)
      values = sorted_values
      return nil if values.nil? || values.empty?

      n = values.size
      return values[0].to_d if n == 1

      p = BigDecimal(p.to_s)
      raise ArgumentError, "p must be between 0 and 1" unless p >= 0 && p <= 1

      index = p * (n - 1)
      lo = index.floor
      hi = index.ceil
      return values[lo].to_d if lo == hi

      weight = index - lo
      lo_v = values[lo].to_d
      hi_v = values[hi].to_d
      lo_v + (hi_v - lo_v) * weight
    end
  end
end
