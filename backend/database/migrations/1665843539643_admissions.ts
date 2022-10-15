import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'admissions'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('eta').notNullable().alter()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('eta').notNullable().alter()
    })
  }
}
