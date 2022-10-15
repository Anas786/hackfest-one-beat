import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'patient_medication_orders'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('meds').after('iv_fluid_id')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('meds')
    })
  }
}
