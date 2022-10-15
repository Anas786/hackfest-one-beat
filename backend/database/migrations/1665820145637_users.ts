import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('npi', 'is_real')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('npi', 12).after('degree_id')
      table.boolean('is_real').defaultTo(true).after('is_active')
    })
  }
}
