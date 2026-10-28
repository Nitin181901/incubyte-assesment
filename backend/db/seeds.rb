# Idempotent seed entrypoint. Delegates to Seeding::EmployeeSeeder.
# Force a rebuild with: RESEED=1 bin/rails db:seed
Seeding::EmployeeSeeder.new.call
