require "test_helper"

class EmployeeTest < ActiveSupport::TestCase
  setup do
    @us = countries(:united_states)
    @india = countries(:india)
    @alice = employees(:alice)
  end

  test "computes salary_usd from salary and country usd_rate" do
    employee = Employee.new(
      first_name: "New",
      last_name: "Hire",
      email: "new.hire@acme.test",
      country: @india,
      department: "Engineering",
      job_title: "Software Engineer",
      salary: 1_000_000,
      hired_on: Date.new(2024, 1, 1)
    )

    assert employee.valid?
    assert_equal BigDecimal("12000.00"), employee.salary_usd
  end

  test "creating an employee records a salary change with nil old_salary" do
    employee = Employee.create!(
      first_name: "New",
      last_name: "Hire",
      email: "create.history@acme.test",
      country: @us,
      department: "Sales",
      job_title: "Account Manager",
      salary: 70_000,
      hired_on: Date.new(2023, 5, 1),
      reason: "Initial salary",
      changed_by: users(:one)
    )

    change = employee.salary_changes.sole
    assert_nil change.old_salary
    assert_equal BigDecimal("70000.00"), change.new_salary
    assert_equal "USD", change.currency_code
    assert_equal "Initial salary", change.reason
    assert_equal users(:one), change.changed_by
  end

  test "changing salary creates a history row with old and new" do
    assert_difference -> { @alice.salary_changes.count }, 1 do
      @alice.reason = "Annual raise"
      @alice.changed_by = users(:one)
      @alice.update!(salary: 110_000)
    end

    change = @alice.salary_changes.order(:created_at).last
    assert_equal BigDecimal("100000.00"), change.old_salary
    assert_equal BigDecimal("110000.00"), change.new_salary
    assert_equal "Annual raise", change.reason
  end

  test "validates presence of names department and job_title" do
    employee = Employee.new(country: @us, salary: 1, hired_on: Date.current, email: "x@y.com")
    assert_not employee.valid?
    assert_includes employee.errors[:first_name], "can't be blank"
    assert_includes employee.errors[:last_name], "can't be blank"
    assert_includes employee.errors[:department], "can't be blank"
    assert_includes employee.errors[:job_title], "can't be blank"
  end

  test "validates email format and salary greater than zero" do
    employee = employees(:bob)
    employee.email = "not-an-email"
    employee.salary = 0
    assert_not employee.valid?
    assert_includes employee.errors[:email], "is invalid"
    assert_includes employee.errors[:salary], "must be greater than 0"
  end

  test "rejects hired_on in the future" do
    @alice.hired_on = Date.current + 1
    assert_not @alice.valid?
    assert_includes @alice.errors[:hired_on], "can't be in the future"
  end

  test "search matches case-insensitively on name and email" do
    results = Employee.search("ALICE")
    assert_includes results, @alice
    assert_includes Employee.search("anderson@acme"), @alice
  end

  test "search escapes SQL LIKE wildcards" do
    results = Employee.search("100%")
    assert_includes results, employees(:frank)
    assert_equal 1, results.count

    results = Employee.search("_Wildcard")
    assert_includes results, employees(:frank)
    assert_equal 1, results.count
  end

  test "filter scopes" do
    assert_equal [ employees(:alice), employees(:carol), employees(:frank) ].sort_by(&:id),
                 Employee.in_department("Engineering").order(:id).to_a
    assert_equal [ employees(:alice), employees(:carol) ].sort_by(&:id),
                 Employee.with_title("Software Engineer").order(:id).to_a
    assert_equal [ employees(:carol), employees(:dave) ].sort_by(&:id),
                 Employee.in_country(@india.id).order(:id).to_a
    assert_equal [ employees(:carol), employees(:dave) ].sort_by(&:id),
                 Employee.salary_between(10_000, 30_000).order(:id).to_a
  end

  test "tenure_years with a fixed as_of" do
    # hired 2020-01-15; as_of 2024-01-15 => exactly 4 * 365.25 days in common calc:
    # (Date.new(2024,1,15) - Date.new(2020,1,15)) = 1461 days; 1461/365.25 ≈ 4.0
    years = @alice.tenure_years(as_of: Date.new(2024, 1, 15))
    assert_in_delta 4.0, years, 0.01
  end
end
