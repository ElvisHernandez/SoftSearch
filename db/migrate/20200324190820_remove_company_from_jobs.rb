class RemoveCompanyFromJobs < ActiveRecord::Migration[6.0]
  def change
    remove_column :jobs, :company, :string
  end
end
