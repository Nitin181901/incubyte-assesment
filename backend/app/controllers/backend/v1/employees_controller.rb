module Backend
  module V1
    class EmployeesController < BaseController
      before_action :set_employee, only: %i[show update destroy]

      def index
        query = Employees::Query.new(params: index_params)
        employees = query.call
        render json: {
          data: employees.map { |employee| employee_json(employee) },
          meta: query.meta
        }
      rescue Employees::Query::InvalidSort => e
        render_error(e.message, status: :unprocessable_entity, details: { sort: [ "is not included in the list" ] })
      end

      def show
        render json: employee_json(@employee)
      end

      def create
        employee = Employee.new(employee_params)
        assign_salary_change_context(employee)

        if employee.save
          render json: employee_json(employee), status: :created
        else
          render_validation_errors(employee)
        end
      end

      def update
        assign_salary_change_context(@employee)
        if @employee.update(employee_params)
          render json: employee_json(@employee)
        else
          render_validation_errors(@employee)
        end
      end

      def destroy
        @employee.destroy!
        head :no_content
      end

      def export
        query = Employees::Query.new(params: index_params)
        filename = "employees-#{Date.current.iso8601}.csv"
        response.headers["Content-Type"] = "text/csv; charset=utf-8"
        response.headers["Content-Disposition"] = "attachment; filename=\"#{filename}\""
        # Enumerator response_body: Rails writes each yielded chunk (no ActionController::Live).
        self.response_body = Employees::CsvExporter.new(query.export_scope).enum
      rescue Employees::Query::InvalidSort => e
        render_error(e.message, status: :unprocessable_entity, details: { sort: [ "is not included in the list" ] })
      end

      def import
        result = Employees::CsvImporter.new(
          file: params[:file],
          dry_run: ActiveModel::Type::Boolean.new.cast(params[:dry_run]),
          changed_by: current_user
        ).call
        render json: result
      rescue Employees::CsvImporter::Error => e
        render_error(e.message, status: :unprocessable_entity)
      end

      private

      def set_employee
        @employee = Employee.includes(:country).find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render_not_found
      end

      def assign_salary_change_context(employee)
        employee.changed_by = current_user
        employee.reason = params[:change_reason] if params.key?(:change_reason)
      end

      def index_params
        params.permit(
          :q, :country, :department, :job_title,
          :min_salary_usd, :max_salary_usd,
          :sort, :dir, :page, :per_page
        )
      end

      def employee_params
        params.permit(
          :first_name, :last_name, :email, :country_id,
          :department, :job_title, :salary, :hired_on
        )
      end
    end
  end
end
