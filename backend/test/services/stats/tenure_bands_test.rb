require "test_helper"

class Stats::TenureBandsTest < ActiveSupport::TestCase
  setup do
    SalaryChange.delete_all
    Employee.delete_all
    @country = countries(:united_states)
    @as_of = Date.new(2024, 1, 1)
  end

  test "band boundaries exactly at 2 and 5 years" do
    # Tenure years = (as_of - hired_on) / 365.25.
    # 2y boundary: days >= 730.5 → use 731 days (>= 2 → "2-5"), 730 days (< 2 → "0-2").
    # 5y boundary: days >= 1826.25 → use 1827 days (>= 5 → "5+"), 1826 days (< 5 → "2-5").
    create!(hired_on: @as_of - 365, salary_usd: 10_000)   # ~1y → 0-2
    create!(hired_on: @as_of - 730, salary_usd: 15_000)   # just under 2 → 0-2
    create!(hired_on: @as_of - 731, salary_usd: 20_000)   # just at/over 2 → 2-5
    create!(hired_on: @as_of - 1826, salary_usd: 30_000)  # just under 5 → 2-5
    create!(hired_on: @as_of - 1827, salary_usd: 40_000)  # just at/over 5 → 5+
    create!(hired_on: @as_of - 3000, salary_usd: 50_000)  # long tenure → 5+

    bands = Stats::TenureBands.call(as_of: @as_of).index_by { |r| r[:band] }

    assert_equal 2, bands["0-2"][:headcount]
    assert_equal BigDecimal("12500"), bands["0-2"][:median]

    assert_equal 2, bands["2-5"][:headcount]
    assert_equal BigDecimal("25000"), bands["2-5"][:median]

    assert_equal 2, bands["5+"][:headcount]
    assert_equal BigDecimal("45000"), bands["5+"][:median]
  end


  private

  def create!(hired_on:, salary_usd:)
    @seq = (@seq || 0) + 1
    Employee.create!(
      first_name: "Ten",
      last_name: "Emp#{@seq}",
      email: "ten.emp#{@seq}@acme.test",
      country: @country,
      department: "Engineering",
      job_title: "Engineer",
      salary: salary_usd,
      hired_on: hired_on
    )
  end
end
