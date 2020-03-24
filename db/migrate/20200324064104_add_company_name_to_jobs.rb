class AddCompanyNameToJobs < ActiveRecord::Migration[6.0]
  def change
    add_column :jobs, :company_name, :string, null: false
  end
end
