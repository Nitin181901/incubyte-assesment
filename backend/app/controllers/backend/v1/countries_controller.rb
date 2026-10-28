module Backend
  module V1
    class CountriesController < BaseController
      def index
        render json: {
          data: Country.order(:code).map { |country| country_json(country) }
        }
      end

      def update
        country = Country.find_by!(code: params[:code].to_s.upcase)
        if country.update(usd_rate: params.require(:usd_rate))
          render json: country_json(country)
        else
          render_validation_errors(country)
        end
      rescue ActiveRecord::RecordNotFound
        render_not_found and return
      rescue ActionController::ParameterMissing => e
        render_error("validation_failed", status: :unprocessable_entity, details: { e.param => [ "is required" ] })
      end

    end
  end
end
