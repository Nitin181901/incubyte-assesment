class Employee < ApplicationRecord
  include Tenure

  belongs_to :country
  has_many :salary_changes, dependent: :delete_all

  attr_accessor :changed_by, :reason

  normalizes :email, with: ->(email) { email.to_s.strip.downcase }

  validates :first_name, :last_name, :department, :job_title, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :salary, presence: true, numericality: { greater_than: 0 }
  validates :hired_on, presence: true
  validate :hired_on_not_in_the_future

  before_validation :compute_salary_usd
  after_save :record_salary_change, if: :saved_change_to_salary?

  scope :in_country, ->(country_id) { where(country_id: country_id) }
  scope :in_department, ->(department) { where(department: department) }
  scope :with_title, ->(title) { where(job_title: title) }
  scope :salary_between, ->(min, max) { where(salary_usd: min..max) }

  scope :search, ->(q) {
    next all if q.blank?

    escaped = q.to_s.downcase.gsub(/[\\%_]/) { |char| "\\#{char}" }
    pattern = "%#{escaped}%"
    where(
      "LOWER(first_name) LIKE ? ESCAPE '\\' OR LOWER(last_name) LIKE ? ESCAPE '\\' OR LOWER(email) LIKE ? ESCAPE '\\'",
      pattern, pattern, pattern
    )
  }

  private

  def compute_salary_usd
    return if salary.blank? || country.blank?

    self.salary_usd = (BigDecimal(salary.to_s) * BigDecimal(country.usd_rate.to_s)).round(2)
  end

  def record_salary_change
    old_salary, = saved_change_to_salary
    salary_changes.create!(
      old_salary: old_salary,
      new_salary: salary,
      currency_code: country.currency_code,
      reason: reason,
      changed_by: changed_by
    )
  end

  def hired_on_not_in_the_future
    return if hired_on.blank?
    return unless hired_on > Date.current

    errors.add(:hired_on, "can't be in the future")
  end
end
