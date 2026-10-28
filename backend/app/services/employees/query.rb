module Employees
  class Query
    SORT_WHITELIST = %w[name salary salary_usd hired_on country job_title department].freeze


    class InvalidSort < StandardError; end

    attr_reader :total

    def initialize(scope: Employee.all, params: {})
      @scope = scope
      @params = params
      @total = 0
    end

    def call
      relation = filtered
      @total = relation.count
      apply_sort(relation).includes(:country).offset(offset).limit(per_page)
    end

    # Filtered + sorted scope without pagination (for CSV export).
    def export_scope
      apply_sort(filtered).includes(:country)
    end

    def meta
      {
        page: page,
        per_page: per_page,
        total: total,
        total_pages: per_page.zero? ? 0 : (total.to_f / per_page).ceil
      }
    end

    private

    def filtered

      relation = @scope.all
      relation = relation.search(@params[:q]) if @params[:q].present?

      if @params[:country].present?
        relation = relation.where(
          country_id: Country.where(code: @params[:country].to_s.upcase).select(:id)
        )
      end

      relation = relation.in_department(@params[:department]) if @params[:department].present?
      relation = relation.with_title(@params[:job_title]) if @params[:job_title].present?

      if @params[:min_salary_usd].present?
        relation = relation.where("salary_usd >= ?", @params[:min_salary_usd])
      end
      if @params[:max_salary_usd].present?
        relation = relation.where("salary_usd <= ?", @params[:max_salary_usd])
      end

      relation
    end

    def apply_sort(relation)
      sort = @params[:sort].presence
      return relation.order("employees.last_name ASC, employees.first_name ASC") if sort.blank?
      raise InvalidSort, "invalid sort" unless SORT_WHITELIST.include?(sort)

      dir = @params[:dir].to_s.downcase == "desc" ? "DESC" : "ASC"

      case sort
      when "name"
        relation.order(Arel.sql("employees.last_name #{dir}, employees.first_name #{dir}"))
      when "country"
        relation.left_joins(:country).order(Arel.sql("countries.code #{dir}"))
      when "salary", "salary_usd", "hired_on", "job_title", "department"
        relation.order(Arel.sql("employees.#{sort} #{dir}"))

      else
        relation
      end
    end

    def page
      [ @params[:page].to_i, 1 ].max
    end

    def per_page
      value = @params[:per_page].presence&.to_i || 25
      value = 25 if value < 1
      [ value, 100 ].min
    end

    def offset
      (page - 1) * per_page
    end
  end
end
