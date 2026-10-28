require "test_helper"

class Stats::BreakdownTest < ActiveSupport::TestCase
  setup do
    SalaryChange.delete_all
    Employee.delete_all
    @us = countries(:united_states)
    @in = countries(:india)
  end

  test "rejects unknown by" do
    assert_raises(ArgumentError) { Stats::Breakdown.new(by: :region) }
  end

  test "groups by department with known percentiles and sorts by headcount desc" do
    # Eng: 10,20,30,40 -> median 25, p25 17.5, p75 32.5, p90 37
    [ 10_000, 20_000, 30_000, 40_000 ].each { |s| create!(department: "Engineering", salary_usd: s, country: @us) }
    # Sales: 50,60 -> median 55, headcount 2
    [ 50_000, 60_000 ].each { |s| create!(department: "Sales", salary_usd: s, country: @us) }

    rows = Stats::Breakdown.new(by: :department).call
    assert_equal [ "Engineering", "Sales" ], rows.map { |r| r[:key] }
    eng = rows.first
    assert_equal 4, eng[:headcount]
    assert_equal BigDecimal("25000"), eng[:avg]
    assert_equal BigDecimal("25000"), eng[:median]
    assert_equal BigDecimal("17500"), eng[:p25]
    assert_equal BigDecimal("32500"), eng[:p75]
    assert_equal BigDecimal("37000"), eng[:p90]
  end

  test "country breakdown key includes code and name" do
    create!(department: "HR", salary_usd: 10_000, country: @us)
    create!(department: "HR", salary_usd: 12_000, country: @us)
    create!(department: "HR", salary_usd: 8_000, country: @in)

    rows = Stats::Breakdown.new(by: :country).call
    assert_equal 2, rows.size
    assert_equal({ code: "US", name: "United States" }, rows.first[:key])
    assert_equal 2, rows.first[:headcount]
  end

  private

  def create!(department:, salary_usd:, country:, job_title: "Role")
    @seq = (@seq || 0) + 1
    # salary in local = salary_usd / rate so callback stores expected salary_usd
    local = (BigDecimal(salary_usd.to_s) / BigDecimal(country.usd_rate.to_s)).round(2)
    Employee.create!(
      first_name: "Bd",
      last_name: "Emp#{@seq}",
      email: "bd.emp#{@seq}@acme.test",
      country: country,
      department: department,
      job_title: job_title,
      salary: local,
      hired_on: Date.new(2020, 1, 1)
    )
  end
end
