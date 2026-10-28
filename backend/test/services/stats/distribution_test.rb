require "test_helper"

class Stats::DistributionTest < ActiveSupport::TestCase
  setup do
    SalaryChange.delete_all
    Employee.delete_all
    @country = countries(:united_states)
  end

  test "empty data returns empty histogram" do
    assert_equal [], Stats::Distribution.new(bins: 5).call
  end

  test "all-equal salaries produce a single bin" do
    3.times { create!(salary_usd: 50_000) }

    bins = Stats::Distribution.new(bins: 10).call
    assert_equal 1, bins.size
    assert_equal BigDecimal("50000"), bins[0][:from]
    assert_equal BigDecimal("50000"), bins[0][:to]
    assert_equal 3, bins[0][:count]
  end

  test "equal-width bins and max falls into last bin" do
    # values 100..200 with 2 bins => [100,150) and [150,200]; max always last bin
    [ 100, 125, 150, 200 ].each { |s| create!(salary_usd: s) }

    bins = Stats::Distribution.new(bins: 2).call
    assert_equal 2, bins.size
    assert_equal BigDecimal("100"), bins[0][:from]
    assert_equal BigDecimal("150"), bins[0][:to]
    assert_equal BigDecimal("150"), bins[1][:from]
    assert_equal BigDecimal("200"), bins[1][:to]

    # 100,125 in first; 150 and 200 in second
    assert_equal 2, bins[0][:count]
    assert_equal 2, bins[1][:count]
  end


  private

  def create!(salary_usd:)
    @seq = (@seq || 0) + 1
    Employee.create!(
      first_name: "Dist",
      last_name: "Emp#{@seq}",
      email: "dist.emp#{@seq}@acme.test",
      country: @country,
      department: "Engineering",
      job_title: "Engineer",
      salary: salary_usd,
      hired_on: Date.new(2020, 1, 1)
    )
  end
end
