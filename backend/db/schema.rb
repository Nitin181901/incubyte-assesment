# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_10_28_093002) do
  create_table "countries", force: :cascade do |t|
    t.string "code", null: false
    t.string "name", null: false
    t.string "currency_code", null: false
    t.decimal "usd_rate", precision: 14, scale: 6, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_countries_on_code", unique: true
  end

  create_table "employees", force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "email", null: false
    t.integer "country_id", null: false
    t.string "department", null: false
    t.string "job_title", null: false
    t.decimal "salary", precision: 14, scale: 2, null: false
    t.decimal "salary_usd", precision: 14, scale: 2, null: false
    t.date "hired_on", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index "LOWER(email)", name: "index_employees_on_lower_email", unique: true
    t.index ["country_id"], name: "index_employees_on_country_id"
    t.index ["department"], name: "index_employees_on_department"
    t.index ["hired_on"], name: "index_employees_on_hired_on"
    t.index ["job_title", "country_id"], name: "index_employees_on_job_title_and_country_id"
    t.index ["job_title"], name: "index_employees_on_job_title"
    t.index ["last_name", "first_name"], name: "index_employees_on_last_name_and_first_name"
    t.index ["salary_usd"], name: "index_employees_on_salary_usd"
  end

  create_table "salary_changes", force: :cascade do |t|
    t.integer "employee_id", null: false
    t.decimal "old_salary", precision: 14, scale: 2
    t.decimal "new_salary", precision: 14, scale: 2, null: false
    t.string "currency_code", null: false
    t.string "reason"
    t.integer "changed_by_id"
    t.datetime "created_at", null: false
    t.index ["changed_by_id"], name: "index_salary_changes_on_changed_by_id"
    t.index ["employee_id", "created_at"], name: "index_salary_changes_on_employee_id_and_created_at"
    t.index ["employee_id"], name: "index_salary_changes_on_employee_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "name"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "employees", "countries"
  add_foreign_key "salary_changes", "employees", on_delete: :cascade
  add_foreign_key "salary_changes", "users", column: "changed_by_id"
end
