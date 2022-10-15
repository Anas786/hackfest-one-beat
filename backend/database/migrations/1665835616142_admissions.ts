import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'admissions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('code', 10)
      table.integer('patient_id').notNullable()
      table.integer('facility_id').notNullable()
      table.integer('transportation_id')
      table.integer('bed_type_id')
      table.integer('eta').notNullable()
      table.integer('status').notNullable().defaultTo(1).comment('1=Initiated, 2=Approved, 3=Rejected, 4=Patient Arrived, 5=Cancelled, 6=Discharged')

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
