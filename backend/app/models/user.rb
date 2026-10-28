class User < ApplicationRecord
  has_secure_password

  generates_token_for :api, expires_in: 12.hours do
    # Embed password salt so tokens die when the password changes.
    password_salt&.last(10)
  end

  normalizes :email, with: ->(email) { email.strip.downcase }

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true
  validates :password, length: { minimum: 8 }, allow_nil: true
end
