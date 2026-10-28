module Stats
  class Outliers
    def initialize(threshold: 0.4, min_group_size: 5, limit: 50)
      @threshold = threshold.to_d
      @min_group_size = min_group_size
      @limit = limit
    end

    def call(scope = Employee.all)
      # One employee pluck (+ tiny country lookup); group/median in Ruby.
      rows = scope.pluck(:id, :first_name, :last_name, :job_title, :country_id, :salary_usd)
      return [] if rows.empty?

      countries = Country.where(id: rows.map { |r| r[4] }.uniq).pluck(:id, :code, :name)
                         .to_h { |id, code, name| [ id, { code: code, name: name } ] }

      grouped = rows.group_by { |(_id, _fn, _ln, title, country_id, _sal)| [ title, country_id ] }

      outliers = []
      grouped.each do |(job_title, country_id), members|
        next if members.size < @min_group_size

        salaries = members.map { |m| m[5].to_d }.sort
        median = Percentile.call(salaries, 0.5)
        next if median.nil? || median.zero?

        members.each do |id, first_name, last_name, _title, _cid, salary_usd|
          salary = salary_usd.to_d
          deviation_pct = (salary - median) / median
          next unless deviation_pct.abs > @threshold

          outliers << {
            id: id,
            name: "#{first_name} #{last_name}",
            job_title: job_title,
            country: countries[country_id],
            salary_usd: salary,
            group_median: median,
            deviation_pct: deviation_pct,
            group_size: members.size
          }
        end
      end

      outliers.sort_by { |row| [ -row[:deviation_pct].abs, row[:id] ] }
              .first(@limit)
    end
  end
end
