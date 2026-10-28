module Backend
  module V1
    class StatsController < BaseController
      def summary
        payload = stats_cache("summary") { Stats::Summary.call }
        render json: serialize_numbers(payload)
      end

      def breakdown
        by = params[:by].to_s
        unless %w[country department job_title].include?(by)
          return render_error(
            "validation_failed",
            status: :unprocessable_entity,
            details: { by: [ "must be country, department, or job_title" ] }
          )
        end

        payload = stats_cache("breakdown", by: by) { Stats::Breakdown.new(by: by).call }
        render json: { by: by, data: payload }
      end

      def distribution
        bins = (params[:bins].presence || 20).to_i
        bins = bins.clamp(1, 100)

        payload = stats_cache("distribution", bins: bins) { Stats::Distribution.new(bins: bins).call }
        render json: { bins: bins, data: payload }
      end

      def tenure
        as_of = Date.current
        payload = stats_cache("tenure", as_of: as_of.iso8601) { Stats::TenureBands.call(as_of: as_of) }
        render json: { as_of: as_of, data: payload }
      end

      def outliers
        threshold = (params[:threshold].presence || 0.4).to_d
        threshold = threshold.clamp(BigDecimal("0.01"), BigDecimal("5"))
        limit = (params[:limit].presence || 50).to_i.clamp(1, 200)
        min_group_size = (params[:min_group_size].presence || 5).to_i.clamp(2, 100)

        payload = stats_cache("outliers", threshold: threshold.to_s, limit: limit, min_group_size: min_group_size) do
          Stats::Outliers.new(threshold: threshold, limit: limit, min_group_size: min_group_size).call
        end
        render json: { threshold: threshold, limit: limit, data: payload }
      end

      private

      def serialize_numbers(payload)
        payload.transform_values { |value| value.is_a?(BigDecimal) ? value : value }
      end
    end
  end
end
