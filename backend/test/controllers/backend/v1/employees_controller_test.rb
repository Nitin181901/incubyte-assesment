require "test_helper"

class Backend::V1::EmployeesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @alice = employees(:alice)
    @headers = auth_headers
  end

  test "index requires auth" do
    get backend_v1_employees_url
    assert_response :unauthorized
    assert_equal "unauthorized", response.parsed_body["error"]
  end

  test "index returns paginated meta" do
    get backend_v1_employees_url, params: { page: 1, per_page: 2 }, headers: @headers

    assert_response :ok
    body = response.parsed_body
    assert_equal 2, body["data"].size
    assert_equal 1, body["meta"]["page"]
    assert_equal 2, body["meta"]["per_page"]
    assert_equal 6, body["meta"]["total"]
    assert_equal 3, body["meta"]["total_pages"]
    assert body["data"].first["country"]["code"].present?
  end

  test "index search" do
    get backend_v1_employees_url, params: { q: "alice" }, headers: @headers

    assert_response :ok
    emails = response.parsed_body["data"].map { |row| row["email"] }
    assert_equal [ "alice.anderson@acme.test" ], emails
  end

  test "index filters by country department job_title and salary" do
    get backend_v1_employees_url,
        params: { country: "US", department: "Engineering", job_title: "Software Engineer", min_salary_usd: 50_000, max_salary_usd: 120_000 },
        headers: @headers

    assert_response :ok
    data = response.parsed_body["data"]
    assert_equal 1, data.size
    assert_equal @alice.id, data.first["id"]
  end

  test "index rejects invalid sort with 422" do
    get backend_v1_employees_url, params: { sort: "nope" }, headers: @headers

    assert_response :unprocessable_entity
    assert_equal "invalid sort", response.parsed_body["error"]
  end

  test "index accepts whitelisted sort" do
    get backend_v1_employees_url, params: { sort: "salary_usd", dir: "desc" }, headers: @headers

    assert_response :ok
    salaries = response.parsed_body["data"].map { |row| BigDecimal(row["salary_usd"].to_s) }
    assert_equal salaries.sort.reverse, salaries
  end

  test "show requires auth and returns employee" do
    get backend_v1_employee_url(@alice)
    assert_response :unauthorized

    get backend_v1_employee_url(@alice), headers: @headers
    assert_response :ok
    assert_equal @alice.email, response.parsed_body["email"]
    assert_equal "US", response.parsed_body["country"]["code"]
  end

  test "create happy path and 422" do
    post backend_v1_employees_url, headers: @headers, as: :json,
         params: {
           first_name: "New",
           last_name: "Hire",
           email: "new.hire@acme.test",
           country_id: countries(:united_states).id,
           department: "Sales",
           job_title: "Account Manager",
           salary: 70_000,
           hired_on: "2023-01-01",
           change_reason: "Initial salary"
         }

    assert_response :created
    employee = Employee.find_by!(email: "new.hire@acme.test")
    change = employee.salary_changes.sole
    assert_nil change.old_salary
    assert_equal users(:one).id, change.changed_by_id
    assert_equal "Initial salary", change.reason

    post backend_v1_employees_url, headers: @headers, as: :json,
         params: { first_name: "", email: "bad", salary: -1 }
    assert_response :unprocessable_entity
    assert_equal "validation_failed", response.parsed_body["error"]
    assert response.parsed_body["details"].present?
  end

  test "update salary records history with current user and 422 on invalid" do
    patch backend_v1_employee_url(@alice), headers: @headers, as: :json,
          params: { salary: 110_000, change_reason: "Raise" }

    assert_response :ok
    change = @alice.salary_changes.order(:created_at).last
    assert_equal BigDecimal("100000.0"), change.old_salary
    assert_equal BigDecimal("110000.0"), change.new_salary
    assert_equal users(:one).id, change.changed_by_id
    assert_equal "Raise", change.reason

    patch backend_v1_employee_url(@alice), headers: @headers, as: :json, params: { salary: 0 }
    assert_response :unprocessable_entity
  end

  test "destroy requires auth and deletes" do
    delete backend_v1_employee_url(@alice)
    assert_response :unauthorized

    assert_difference("Employee.count", -1) do
      delete backend_v1_employee_url(@alice), headers: @headers
    end
    assert_response :no_content
  end
end
