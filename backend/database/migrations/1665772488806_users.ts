import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('nic', 50).after('password')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('nic')
    })
  }
}
