import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'countries'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('iso3', 50)
      table.string('iso2', 50)
      table.string('phone_code', 50)
      table.string('capital', 50)
      table.string('currency', 50)
      table.string('currency_name', 50)
      table.string('currency_symbol', 50)
      table.text('native')
      table.text('emoji')
      table.text('emoji_u')

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
