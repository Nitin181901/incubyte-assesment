require "test_helper"

class Stats::OutliersTest < ActiveSupport::TestCase
  setup do
    SalaryChange.delete_all
    Employee.delete_all
    @us = countries(:united_states)
    @in = countries(:india)
  end

  test "flags high and low outliers relative to group median" do
    # Group median of [50,50,50,50,50,100,20] => sorted 20,50,50,50,50,50,100; p50=50
    # high 100 => +100%; low 20 => -60%
    base = [ 50_000, 50_000, 50_000, 50_000, 50_000 ]
    base.each { |s| create!(salary_usd: s, title: "SE", country: @us) }
    high = create!(salary_usd: 100_000, title: "SE", country: @us, name: [ "High", "Flyer" ])
    low = create!(salary_usd: 20_000, title: "SE", country: @us, name: [ "Low", "Pay" ])

    rows = Stats::Outliers.new(threshold: 0.4, min_group_size: 5).call
    ids = rows.map { |r| r[:id] }

    assert_includes ids, high.id
    assert_includes ids, low.id

    high_row = rows.find { |r| r[:id] == high.id }
    low_row = rows.find { |r| r[:id] == low.id }
    assert_equal BigDecimal("50000"), high_row[:group_median]
    assert_in_delta 1.0, high_row[:deviation_pct], 0.0001
    assert_in_delta(-0.6, low_row[:deviation_pct], 0.0001)
    assert_equal "High Flyer", high_row[:name]
    assert_equal({ code: "US", name: "United States" }, high_row[:country])
  end

  test "small groups are ignored" do
    # Only 4 peers (< min_group_size 5), even with an extreme salary.
    3.times { |i| create!(salary_usd: 50_000 + i, title: "Tiny", country: @us) }
    create!(salary_usd: 200_000, title: "Tiny", country: @us)

    assert_equal [], Stats::Outliers.new(threshold: 0.4, min_group_size: 5).call
  end


  test "threshold boundary is exclusive" do
    # median 100; value 140 => exactly +0.4 — should NOT flag with >
    salaries = [ 100_000, 100_000, 100_000, 100_000, 140_000 ]
    salaries.each { |s| create!(salary_usd: s, title: "Boundary", country: @us) }

    assert_equal [], Stats::Outliers.new(threshold: 0.4, min_group_size: 5).call

    # 140001/100000 - 1 > 0.4
    Employee.order(:id).last.update!(salary: 140_001)
    rows = Stats::Outliers.new(threshold: 0.4, min_group_size: 5).call
    assert_equal 1, rows.size
  end

  test "sorted by absolute deviation desc and respects limit" do
    # median ~50k; create several outliers with different magnitudes
    5.times { create!(salary_usd: 50_000, title: "Limit", country: @us) }
    a = create!(salary_usd: 100_000, title: "Limit", country: @us) # +100%
    b = create!(salary_usd: 80_000, title: "Limit", country: @us)  # +60%
    c = create!(salary_usd: 10_000, title: "Limit", country: @us)  # -80%

    rows = Stats::Outliers.new(threshold: 0.4, min_group_size: 5, limit: 2).call
    assert_equal 2, rows.size
    assert_equal a.id, rows[0][:id]
    assert_equal c.id, rows[1][:id]
    assert_operator rows[0][:deviation_pct].abs, :>=, rows[1][:deviation_pct].abs
  end

  test "groups by job_title and country separately" do
    5.times { create!(salary_usd: 50_000, title: "SE", country: @us) }
    create!(salary_usd: 200_000, title: "SE", country: @us) # outlier in US SE

    5.times { create!(salary_usd: 50_000, title: "SE", country: @in) }
    # IN SE has no extreme outlier relative to its own median

    rows = Stats::Outliers.new(threshold: 0.4, min_group_size: 5).call
    assert rows.all? { |r| r[:country][:code] == "US" }
  end

  private

  def create!(salary_usd:, title:, country:, name: nil)
    @seq = (@seq || 0) + 1
    first, last = name || [ "Out", "Emp#{@seq}" ]
    local = (BigDecimal(salary_usd.to_s) / BigDecimal(country.usd_rate.to_s)).round(2)
    Employee.create!(
      first_name: first,
      last_name: last,
      email: "out.emp#{@seq}@acme.test",
      country: country,
      department: "Engineering",
      job_title: title,
      salary: local,
      hired_on: Date.new(2020, 1, 1)
    )
  end
end
