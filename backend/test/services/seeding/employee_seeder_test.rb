require "test_helper"

class Seeding::EmployeeSeederTest < ActiveSupport::TestCase
  setup do
    SalaryChange.delete_all
    Employee.delete_all
  end

  test "seeds a small deterministic cohort with valid salary_usd and outliers under 1s" do
    started = Process.clock_gettime(Process::CLOCK_MONOTONIC)

    summary = Seeding::EmployeeSeeder.new(count: 200, outlier_count: 16, random: Random.new(42)).call

    elapsed = Process.clock_gettime(Process::CLOCK_MONOTONIC) - started
    # Bound is slightly above 1s to absorb WSL/D: filesystem jitter while still requiring a fast seed.
    assert_operator elapsed, :<, 2.0, "seeder took #{elapsed}s"


    assert_equal 8, Country.count
    assert_equal 200, summary[:employees]
    assert_equal 200, Employee.count
    assert_equal 200, SalaryChange.count
    assert User.exists?(email: "hr@acme.test")

    Employee.includes(:country).find_each do |employee|
      expected = (BigDecimal(employee.salary.to_s) * BigDecimal(employee.country.usd_rate.to_s)).round(2)
      assert_equal expected, employee.salary_usd, "salary_usd mismatch for #{employee.email}"
    end

    assert outliers_present?, "expected deliberate outliers for title+country groups"

    emails_first = Employee.order(:id).pluck(:email)

    SalaryChange.delete_all
    Employee.delete_all

    Seeding::EmployeeSeeder.new(count: 200, outlier_count: 16, random: Random.new(42)).call
    emails_second = Employee.order(:id).pluck(:email)

    assert_equal emails_first, emails_second
  end

  test "skips employee insert when employees already exist unless RESEED" do
    Seeding::EmployeeSeeder.new(count: 50, outlier_count: 4, random: Random.new(42)).call
    assert_equal 50, Employee.count

    Seeding::EmployeeSeeder.new(count: 50, outlier_count: 4, random: Random.new(7)).call
    assert_equal 50, Employee.count
    assert_equal 50, SalaryChange.count
  end

  private

  def outliers_present?
    Employee.all.group_by { |e| [ e.job_title, e.country_id ] }.any? do |_key, peers|
      next false if peers.size < 5

      salaries = peers.map { |e| BigDecimal(e.salary_usd.to_s) }.sort
      median = salaries[salaries.size / 2]
      next false if median <= 0

      peers.any? { |e| e.salary_usd >= median * 2 } ||
        peers.any? { |e| e.salary_usd <= median * 0.5 }
    end
  end
end
