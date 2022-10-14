import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'facilities'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('address').notNullable()
      table.string('address2')
      table.string('zip')
      table.string('city').notNullable()
      table.string('state').notNullable()
      table.integer('country_id').notNullable()
      table.decimal('latitude')
      table.decimal('longitude')
      table.integer('facility_type_id').notNullable()
      table.string('phone', 20)
      table.string('email', 100)
      table.string('representative_name', 150)
      table.string('representative_phone', 20)
      table.string('representative_email', 100)
      table.boolean('is_active').defaultTo(true)

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
