module Backend
  module V1
    class SessionsController < ApplicationController
      skip_before_action :authenticate, only: :create

      def create
        user = User.authenticate_by(email: params[:email], password: params[:password])

        if user
          render json: {
            token: user.generate_token_for(:api),
            user: { id: user.id, email: user.email, name: user.name }
          }, status: :ok
        else
          render json: { error: "unauthorized" }, status: :unauthorized
        end
      end
    end
  end
end
