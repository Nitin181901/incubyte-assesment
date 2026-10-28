module Tenure
  extend ActiveSupport::Concern

  # Fractional years of employment as of a given date (365.25-day year).
  def tenure_years(as_of: Date.current)
    return 0.0 if hired_on.blank? || as_of < hired_on

    (as_of - hired_on).to_f / 365.25
  end
end
