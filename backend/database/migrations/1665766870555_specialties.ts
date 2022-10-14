import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'specialties'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('code')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('code', 5).notNullable().after('name')
    })
  }
}
