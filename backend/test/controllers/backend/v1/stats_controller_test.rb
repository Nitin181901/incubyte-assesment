require "test_helper"

class Backend::V1::StatsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @headers = auth_headers
  end

  test "stats endpoints require auth" do
    get backend_v1_stats_summary_url
    assert_response :unauthorized
  end

  test "summary shape on fixtures" do
    get backend_v1_stats_summary_url, headers: @headers

    assert_response :ok
    body = response.parsed_body
    assert_equal 6, body["headcount"]
    assert body["total_payroll_usd"].present?
    assert body["avg"].present?
    assert body["median"].present?
    assert body["min"].present?
    assert body["max"].present?
  end

  test "breakdown shape and validation" do
    get backend_v1_stats_breakdown_url, params: { by: "department" }, headers: @headers

    assert_response :ok
    body = response.parsed_body
    assert_equal "department", body["by"]
    assert body["data"].first.key?("key")
    assert body["data"].first.key?("p90")

    get backend_v1_stats_breakdown_url, params: { by: "nope" }, headers: @headers
    assert_response :unprocessable_entity
  end

  test "distribution tenure outliers shapes" do
    get backend_v1_stats_distribution_url, params: { bins: 5 }, headers: @headers
    assert_response :ok
    assert_equal 5, response.parsed_body["bins"]
    assert response.parsed_body["data"].is_a?(Array)

    get backend_v1_stats_tenure_url, headers: @headers
    assert_response :ok
    bands = response.parsed_body["data"].map { |row| row["band"] }
    assert_equal [ "0-2", "2-5", "5+" ], bands

    get backend_v1_stats_outliers_url, params: { threshold: 0.4, limit: 10 }, headers: @headers
    assert_response :ok
    assert_equal "0.4", response.parsed_body["threshold"].to_s
    assert_equal 10, response.parsed_body["limit"]
    assert response.parsed_body["data"].is_a?(Array)
  end
end
