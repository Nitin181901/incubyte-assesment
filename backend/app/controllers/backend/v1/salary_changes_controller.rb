module Backend
  module V1
    class SalaryChangesController < BaseController
      def index
        employee = Employee.find(params[:employee_id])
        changes = employee.salary_changes.order(created_at: :desc, id: :desc)
        render json: { data: changes.map { |change| salary_change_json(change) } }
      rescue ActiveRecord::RecordNotFound
        render_not_found and return
      end

    end
  end
end
