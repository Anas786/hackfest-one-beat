import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'appointments'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('code').notNullable()
      table.integer('user_id').notNullable()
      table.integer('facility_id').notNullable()
      table.date('appointment_date').notNullable()
      table.string('appointment_time').notNullable()
      table.integer('doctor_id')
      table.integer('status').defaultTo(1).comment('1=Pending, 2=Confirmed, 3=Rejected, 4=Cancelled, 5=Completed')

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
