module Backend
  module V1
    class BaseController < ApplicationController
      private

      def render_error(message, status:, details: {})
        render json: { error: message, details: details }, status: status
      end

      def render_not_found(message = "not_found")
        render_error(message, status: :not_found)
      end

      def render_validation_errors(record)
        render_error("validation_failed", status: :unprocessable_entity, details: record.errors.to_hash(true))
      end

      def employee_json(employee)
        {
          id: employee.id,
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          department: employee.department,
          job_title: employee.job_title,
          salary: employee.salary,
          salary_usd: employee.salary_usd,
          hired_on: employee.hired_on,
          country: country_json(employee.country)
        }
      end

      def country_json(country)
        {
          id: country.id,
          code: country.code,
          name: country.name,
          currency_code: country.currency_code,
          usd_rate: country.usd_rate
        }
      end

      def salary_change_json(change)
        {
          id: change.id,
          old_salary: change.old_salary,
          new_salary: change.new_salary,
          currency_code: change.currency_code,
          reason: change.reason,
          changed_by_id: change.changed_by_id,
          created_at: change.created_at
        }
      end

      def stats_cache(name, **parts)
        key = [
          "stats",
          name,
          Employee.count,
          Employee.maximum(:updated_at),
          parts
        ]
        Rails.cache.fetch(key, expires_in: 60.seconds) { yield }
      end
    end
  end
end
