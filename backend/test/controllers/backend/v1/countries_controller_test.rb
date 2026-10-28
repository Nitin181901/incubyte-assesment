require "test_helper"

class Backend::V1::CountriesControllerTest < ActionDispatch::IntegrationTest
  test "index requires auth" do
    get backend_v1_countries_url
    assert_response :unauthorized
  end

  test "index lists countries" do
    get backend_v1_countries_url, headers: auth_headers

    assert_response :ok
    codes = response.parsed_body["data"].map { |row| row["code"] }
    assert_includes codes, "US"
    assert_includes codes, "IN"
  end

  test "update usd_rate recomputes employee salary_usd" do
    india = countries(:india)
    carol = employees(:carol)

    patch backend_v1_country_url("IN"), headers: auth_headers, as: :json, params: { usd_rate: 0.015 }

    assert_response :ok
    assert_equal BigDecimal("0.015"), india.reload.usd_rate
    assert_equal BigDecimal("30000.0"), carol.reload.salary_usd
  end

  test "update requires auth and rejects non-positive rate" do
    patch backend_v1_country_url("US"), as: :json, params: { usd_rate: 1.1 }
    assert_response :unauthorized

    patch backend_v1_country_url("US"), headers: auth_headers, as: :json, params: { usd_rate: 0 }
    assert_response :unprocessable_entity
  end
end
