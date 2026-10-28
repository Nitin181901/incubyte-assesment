require "test_helper"

class Stats::SummaryTest < ActiveSupport::TestCase
  setup do
    SalaryChange.delete_all
    Employee.delete_all
    @country = countries(:united_states)
  end

  test "summary with known salaries" do
    create_employee!(salary_usd: 10_000)
    create_employee!(salary_usd: 20_000)
    create_employee!(salary_usd: 30_000)
    create_employee!(salary_usd: 40_000)

    result = Stats::Summary.call

    assert_equal 4, result[:headcount]
    assert_equal BigDecimal("100000"), result[:total_payroll_usd]
    assert_equal BigDecimal("25000"), result[:avg]
    assert_equal BigDecimal("25000"), result[:median]
    assert_equal BigDecimal("10000"), result[:min]
    assert_equal BigDecimal("40000"), result[:max]
  end

  test "zero employees returns nils and zeros without raising" do
    result = Stats::Summary.call

    assert_equal 0, result[:headcount]
    assert_equal 0, result[:total_payroll_usd]
    assert_nil result[:avg]
    assert_nil result[:median]
    assert_nil result[:min]
    assert_nil result[:max]
  end

  test "respects optional relation filter" do
    create_employee!(salary_usd: 10_000, department: "Engineering")
    create_employee!(salary_usd: 90_000, department: "Sales")

    result = Stats::Summary.call(Employee.in_department("Engineering"))
    assert_equal 1, result[:headcount]
    assert_equal BigDecimal("10000"), result[:total_payroll_usd]
  end

  private

  def create_employee!(salary_usd:, department: "Engineering")
    @seq = (@seq || 0) + 1
    Employee.create!(
      first_name: "Sum",
      last_name: "Emp#{@seq}",
      email: "sum.emp#{@seq}@acme.test",
      country: @country,
      department: department,
      job_title: "Analyst",
      salary: salary_usd,
      hired_on: Date.new(2020, 1, 1)
    )
  end
end
