require "test_helper"

class Employees::CsvImporterTest < ActiveSupport::TestCase
  setup do
    SalaryChange.delete_all
    Employee.delete_all
    @us = countries(:united_states)
    @in = countries(:india)
    @user = users(:one)
  end

  test "creates updates unchanged reports bad rows and writes history" do
    existing = Employee.create!(
      first_name: "Old",
      last_name: "Name",
      email: "keep@acme.test",
      country: @us,
      department: "Sales",
      job_title: "Account Manager",
      salary: 80_000,
      hired_on: Date.new(2019, 1, 1)
    )
    unchanged = Employee.create!(
      first_name: "Same",
      last_name: "Person",
      email: "same@acme.test",
      country: @us,
      department: "HR",
      job_title: "HR Specialist",
      salary: 70_000,
      hired_on: Date.new(2020, 2, 2)
    )

    csv = <<~CSV
      first_name,last_name,email,country_code,department,job_title,salary,hired_on
      New,Hire,new@acme.test,US,Engineering,Software Engineer,90000,2021-03-03
      Updated,Name,keep@acme.test,US,Sales,Account Manager,95000,2019-01-01
      Same,Person,same@acme.test,US,HR,HR Specialist,70000,2020-02-02
      Bad,Row,bad@acme.test,ZZ,Engineering,Software Engineer,100,2020-01-01
    CSV

    result = Employees::CsvImporter.new(file: StringIO.new(csv), changed_by: @user).call

    assert_equal 1, result[:created]
    assert_equal 1, result[:updated]
    assert_equal 1, result[:unchanged]
    assert_equal 1, result[:failed]
    assert_equal 1, result[:errors].size
    assert_equal 5, result[:errors].first[:row]
    assert_match(/country_code/i, result[:errors].first[:messages].join)

    assert Employee.exists?(email: "new@acme.test")
    assert_equal BigDecimal("95000"), existing.reload.salary
    assert_equal "Same", unchanged.reload.first_name

    created = Employee.find_by!(email: "new@acme.test")
    assert_equal "CSV import", created.salary_changes.last.reason
    assert_equal @user.id, created.salary_changes.last.changed_by_id

    change = existing.salary_changes.order(:id).last
    assert_equal "CSV import", change.reason
    assert_equal BigDecimal("80000"), change.old_salary
    assert_equal BigDecimal("95000"), change.new_salary
  end

  test "dry_run validates without writing" do
    csv = <<~CSV
      first_name,last_name,email,country_code,department,job_title,salary,hired_on
      Dry,Run,dry@acme.test,US,Engineering,Software Engineer,90000,2021-03-03
    CSV

    result = Employees::CsvImporter.new(file: StringIO.new(csv), dry_run: true, changed_by: @user).call

    assert_equal 1, result[:created]
    assert_equal 0, Employee.count
    assert_equal 0, SalaryChange.count
  end

  test "rejects oversized empty and missing header files" do
    empty = StringIO.new("")
    assert_raises(Employees::CsvImporter::Error) do
      Employees::CsvImporter.new(file: empty).call
    end

    oversized = StringIO.new("x")
    def oversized.size
      6 * 1024 * 1024
    end
    error = assert_raises(Employees::CsvImporter::Error) do
      Employees::CsvImporter.new(file: oversized).call
    end
    assert_match(/5 MB/i, error.message)


    no_header = StringIO.new("only,one,line\n")
    # CSV with headers:true treats first line as headers; missing required ones
    error = assert_raises(Employees::CsvImporter::Error) do
      Employees::CsvImporter.new(file: no_header).call
    end
    assert_match(/missing required headers/i, error.message)
  end
end
