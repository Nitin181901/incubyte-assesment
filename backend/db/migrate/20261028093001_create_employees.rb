class CreateEmployees < ActiveRecord::Migration[7.2]
  def change
    create_table :employees do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :email, null: false
      t.references :country, null: false, foreign_key: true
      t.string :department, null: false
      t.string :job_title, null: false
      t.decimal :salary, precision: 14, scale: 2, null: false
      t.decimal :salary_usd, precision: 14, scale: 2, null: false
      t.date :hired_on, null: false

      t.timestamps
    end

    add_index :employees, "LOWER(email)", unique: true, name: "index_employees_on_lower_email"
    add_index :employees, :department
    add_index :employees, :job_title
    add_index :employees, [ :job_title, :country_id ]
    add_index :employees, :hired_on
    add_index :employees, :salary_usd
    add_index :employees, [ :last_name, :first_name ]
  end
end
