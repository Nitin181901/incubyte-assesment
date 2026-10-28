require "test_helper"

class CountryTest < ActiveSupport::TestCase
  test "changing usd_rate updates employee salary_usd with a single UPDATE" do
    india = countries(:india)
    carol = employees(:carol)
    dave = employees(:dave)

    update_sqls = []
    callback = lambda do |_name, _start, _finish, _id, payload|
      sql = payload[:sql]
      update_sqls << sql if sql.match?(/\AUPDATE ["`]?employees/i)
    end

    ActiveSupport::Notifications.subscribed(callback, "sql.active_record") do
      india.update!(usd_rate: 0.015)
    end

    assert_equal 1, update_sqls.size, "expected exactly one employees UPDATE, got: #{update_sqls}"

    carol.reload
    dave.reload
    assert_equal BigDecimal("30000.00"), carol.salary_usd
    assert_equal BigDecimal("22500.00"), dave.salary_usd
  end

  test "validates code and currency_code lengths" do
    country = Country.new(code: "USA", name: "X", currency_code: "US", usd_rate: 1)
    assert_not country.valid?
    assert_includes country.errors[:code], "is the wrong length (should be 2 characters)"
    assert_includes country.errors[:currency_code], "is the wrong length (should be 3 characters)"
  end
end
