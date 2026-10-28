require "test_helper"

class Backend::V1::MetaControllerTest < ActionDispatch::IntegrationTest
  test "requires auth" do
    get backend_v1_meta_filters_url
    assert_response :unauthorized
  end

  test "returns filter options" do
    get backend_v1_meta_filters_url, headers: auth_headers

    assert_response :ok
    body = response.parsed_body
    assert body["countries"].any? { |c| c["code"] == "US" }
    assert_includes body["departments"], "Engineering"
    assert_includes body["job_titles"], "Software Engineer"
  end
end
