import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['code', 'category_id'])
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['code', 'category_id'])
    })
  }
}
