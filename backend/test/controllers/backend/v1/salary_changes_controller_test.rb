require "test_helper"

class Backend::V1::SalaryChangesControllerTest < ActionDispatch::IntegrationTest
  test "requires auth" do
    get backend_v1_employee_salary_changes_url(employees(:alice))
    assert_response :unauthorized
  end

  test "returns history newest first" do
    alice = employees(:alice)
    alice.reason = "First"
    alice.changed_by = users(:one)
    alice.update!(salary: 105_000)
    alice.reason = "Second"
    alice.update!(salary: 110_000)

    get backend_v1_employee_salary_changes_url(alice), headers: auth_headers

    assert_response :ok
    reasons = response.parsed_body["data"].map { |row| row["reason"] }
    assert_equal [ "Second", "First" ], reasons.first(2)
  end
end
