require "test_helper"

class Backend::V1::SessionsControllerTest < ActionDispatch::IntegrationTest
  test "login success" do
    post backend_v1_session_url, params: { email: "user@example.com", password: "password123" }, as: :json

    assert_response :ok
    body = response.parsed_body
    assert body["token"].present?
    assert_equal users(:one).id, body["user"]["id"]
    assert_equal "user@example.com", body["user"]["email"]
    assert_equal "Test User", body["user"]["name"]
  end

  test "login with wrong password" do
    post backend_v1_session_url, params: { email: "user@example.com", password: "wrongpass" }, as: :json

    assert_response :unauthorized
    assert_equal "unauthorized", response.parsed_body["error"]
  end

  test "login with unknown email" do
    post backend_v1_session_url, params: { email: "nobody@example.com", password: "password123" }, as: :json

    assert_response :unauthorized
    assert_equal "unauthorized", response.parsed_body["error"]
  end
end
