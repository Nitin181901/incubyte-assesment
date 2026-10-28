class SalaryChange < ApplicationRecord
  belongs_to :employee
  belongs_to :changed_by, class_name: "User", optional: true

  validates :new_salary, presence: true
  validates :currency_code, presence: true
end
