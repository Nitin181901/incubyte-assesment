require "test_helper"

class Stats::PercentileTest < ActiveSupport::TestCase
  test "empty array returns nil" do
    assert_nil Stats::Percentile.call([], 0.5)
  end

  test "single value returns that value for any p" do
    assert_equal 42, Stats::Percentile.call([ 42 ], 0)
    assert_equal 42, Stats::Percentile.call([ 42 ], 0.5)
    assert_equal 42, Stats::Percentile.call([ 42 ], 1)
  end

  test "odd-sized sample median and quartiles" do
    # Sorted: 1,2,3,4,5 — p50 index 2 => 3; p25 index 1 => 2; p0=1; p100=5
    values = [ 1, 2, 3, 4, 5 ].map(&:to_d)
    assert_equal 3, Stats::Percentile.call(values, 0.5)
    assert_equal 2, Stats::Percentile.call(values, 0.25)
    assert_equal 4, Stats::Percentile.call(values, 0.75)
    assert_equal 1, Stats::Percentile.call(values, 0)
    assert_equal 5, Stats::Percentile.call(values, 1)
  end

  test "even-sized sample uses linear interpolation" do
    # Sorted: 1,2,3,4 — p50 index = 1.5 => 2 + 0.5*(3-2) = 2.5
    values = [ 1, 2, 3, 4 ].map(&:to_d)
    assert_equal BigDecimal("2.5"), Stats::Percentile.call(values, 0.5)

    # p25 index = 0.75 => 1 + 0.75*(2-1) = 1.75
    assert_equal BigDecimal("1.75"), Stats::Percentile.call(values, 0.25)

    # p90 index = 2.7 => 3 + 0.7*(4-3) = 3.7
    assert_equal BigDecimal("3.7"), Stats::Percentile.call(values, 0.9)
  end
end
