import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('gender', ['M', 'F', 'X']).defaultTo('M').after('category_id')
      table.date('dob').after('gender')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('gender', 'dob')
    })
  }
}
