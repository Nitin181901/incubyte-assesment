class CreateSalaryChanges < ActiveRecord::Migration[7.2]
  def change
    create_table :salary_changes do |t|
      t.references :employee, null: false, foreign_key: { on_delete: :cascade }
      t.decimal :old_salary, precision: 14, scale: 2
      t.decimal :new_salary, precision: 14, scale: 2, null: false
      t.string :currency_code, null: false
      t.string :reason
      t.references :changed_by, null: true, foreign_key: { to_table: :users }
      t.datetime :created_at, null: false
    end

    add_index :salary_changes, [ :employee_id, :created_at ]
  end
end
