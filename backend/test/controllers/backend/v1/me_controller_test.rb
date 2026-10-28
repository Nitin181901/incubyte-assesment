require "test_helper"

class Backend::V1::MeControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @token = @user.generate_token_for(:api)
  end

  test "me with token" do
    get backend_v1_me_url, headers: { "Authorization" => "Bearer #{@token}" }, as: :json

    assert_response :ok
    body = response.parsed_body
    assert_equal @user.id, body["id"]
    assert_equal @user.email, body["email"]
    assert_equal @user.name, body["name"]
  end

  test "me without token" do
    get backend_v1_me_url, as: :json

    assert_response :unauthorized
    assert_equal "unauthorized", response.parsed_body["error"]
  end

  test "me with expired token" do
    token = @token

    travel_to 13.hours.from_now do
      get backend_v1_me_url, headers: { "Authorization" => "Bearer #{token}" }, as: :json

      assert_response :unauthorized
      assert_equal "unauthorized", response.parsed_body["error"]
    end
  end
end
