import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'patient_medical_histories'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('appointment_id').notNullable()
      table.integer('patient_id').notNullable()
      table.float('temperature')
      table.float('glucose')
      table.float('bp_systolic')
      table.float('bp_diastolic')
      table.float('pulse')
      table.float('o2_level')
      table.text('other_allergies')
      table.text('notes')

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
