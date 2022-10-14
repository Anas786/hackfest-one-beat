import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'category_roles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('category_id').notNullable()
      table.integer('role_id').notNullable()

      table.unique(['role_id', 'category_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
