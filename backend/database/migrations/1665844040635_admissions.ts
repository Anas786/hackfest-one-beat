import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'admissions'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('appointment_id').after('patient_id')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('appointment_id')
    })
  }
}
