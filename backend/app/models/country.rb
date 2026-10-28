class Country < ApplicationRecord
  has_many :employees, dependent: :restrict_with_exception

  normalizes :code, with: ->(code) { code.to_s.strip.upcase }
  normalizes :currency_code, with: ->(code) { code.to_s.strip.upcase }

  validates :code, presence: true, uniqueness: true, length: { is: 2 }
  validates :name, presence: true
  validates :currency_code, presence: true, length: { is: 3 }
  validates :usd_rate, presence: true, numericality: { greater_than: 0 }

  after_update :recompute_employee_salaries_usd, if: :saved_change_to_usd_rate?

  private

  # Denormalized salary_usd: one bulk UPDATE, no per-row Employee callbacks.
  def recompute_employee_salaries_usd
    Employee.where(country_id: id).update_all(
      [ "salary_usd = ROUND(salary * ?, 2)", usd_rate ]
    )
  end
end
