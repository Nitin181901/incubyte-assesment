require "test_helper"

class Employees::CsvExporterTest < ActiveSupport::TestCase
  setup do
    SalaryChange.delete_all
    Employee.delete_all
  end

  test "exports headers and sanitizes formula injection" do
    country = countries(:united_states)
    Employee.create!(
      first_name: "=Alice",
      last_name: "+Anderson",
      email: "formula@acme.test",
      country: country,
      department: "@Engineering",
      job_title: "-Engineer",
      salary: 50_000,
      hired_on: Date.new(2020, 1, 15)
    )

    csv = Employees::CsvExporter.new(Employee.order(:id).includes(:country)).enum.to_a.join
    lines = CSV.parse(csv)

    assert_equal Employees::CsvExporter::HEADERS, lines.first
    row = lines[1]
    assert_equal "'=Alice", row[0]
    assert_equal "'+Anderson", row[1]
    assert_equal "formula@acme.test", row[2]
    assert_equal "US", row[3]
    assert_equal "'@Engineering", row[4]
    assert_equal "'-Engineer", row[5]
    assert_equal "2020-01-15", row[7]
  end
end
