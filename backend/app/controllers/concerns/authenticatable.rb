module Authenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate
  end

  private

  def authenticate
    token = bearer_token
    @current_user = User.find_by_token_for(:api, token) if token.present?
    return if @current_user

    render json: { error: "unauthorized", details: {} }, status: :unauthorized
  end

  def bearer_token
    header = request.headers["Authorization"].to_s
    return unless header.start_with?("Bearer ")

    header.delete_prefix("Bearer ").presence
  end

  def current_user
    @current_user
  end
end
