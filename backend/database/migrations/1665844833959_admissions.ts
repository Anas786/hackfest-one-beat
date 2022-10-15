import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'admissions'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('referral_facility_id').after('facility_id').notNullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('referral_facility_id')
    })
  }
}
