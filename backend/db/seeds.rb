# Idempotent seed entrypoint. Delegates to Seeding::EmployeeSeeder.
# Force a rebuild with: RESEED=1 bin/rails db:seed
#
# Production (Render): run ONCE after first deploy from the service shell —
#   bin/rails db:seed
# Do not seed on every boot (docker-entrypoint only runs db:prepare).
Seeding::EmployeeSeeder.new.call
