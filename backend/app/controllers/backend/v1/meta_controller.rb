module Backend
  module V1
    class MetaController < BaseController
      def filters
        render json: {
          countries: Country.order(:code).map { |c|
            { code: c.code, name: c.name, currency_code: c.currency_code }
          },
          departments: Employee.distinct.order(:department).pluck(:department),
          job_titles: Employee.distinct.order(:job_title).pluck(:job_title)
        }
      end
    end
  end
end
