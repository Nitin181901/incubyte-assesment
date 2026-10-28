# frozen_string_literal: true

require "benchmark"

count = Employee.count
puts "employees=#{count} countries=#{Country.count}"

times = 30.times.map do
  Benchmark.realtime do
    q = Employees::Query.new(params: { page: 1, per_page: 25 })
    q.call.to_a
    q.meta
  end
end
sorted = times.sort
p50 = sorted[sorted.length / 2]
puts "index_page1_p50_ms=#{(p50 * 1000).round(2)} min=#{(sorted.first * 1000).round(2)} max=#{(sorted.last * 1000).round(2)}"

ftimes = 30.times.map do
  Benchmark.realtime do
    q = Employees::Query.new(
      params: {
        department: "Engineering",
        country: "US",
        page: 1,
        per_page: 25,
        sort: "salary_usd",
        dir: "desc"
      }
    )
    q.call.to_a
    q.meta
  end
end
fs = ftimes.sort
puts "index_filtered_p50_ms=#{(fs[fs.length / 2] * 1000).round(2)} min=#{(fs.first * 1000).round(2)} max=#{(fs.last * 1000).round(2)}"

Rails.cache.clear
cold = Benchmark.realtime { Stats::Summary.call }
key = [ "stats", "summary", Employee.count, Employee.maximum(:updated_at), {} ]
Rails.cache.clear
cold_cached = Benchmark.realtime do
  Rails.cache.fetch(key, expires_in: 60) { Stats::Summary.call }
end
warm = 10.times.map do
  Benchmark.realtime do
    Rails.cache.fetch(key, expires_in: 60) { Stats::Summary.call }
  end
end.min
puts "stats_summary_cold_ms=#{(cold * 1000).round(2)}"
puts "stats_summary_cache_miss_ms=#{(cold_cached * 1000).round(2)}"
puts "stats_summary_cache_hit_ms=#{(warm * 1000).round(2)}"

Rails.cache.clear
bcold = Benchmark.realtime { Stats::Breakdown.new(by: "department").call }
bkey = [ "stats", "breakdown", Employee.count, Employee.maximum(:updated_at), { by: "department" } ]
Rails.cache.fetch(bkey, expires_in: 60) { Stats::Breakdown.new(by: "department").call }
bwarm = Benchmark.realtime do
  Rails.cache.fetch(bkey, expires_in: 60) { Stats::Breakdown.new(by: "department").call }
end
puts "stats_breakdown_cold_ms=#{(bcold * 1000).round(2)} warm_ms=#{(bwarm * 1000).round(2)}"
