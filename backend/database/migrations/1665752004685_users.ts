import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('first_name', 200).notNullable()
      table.string('middle_name', 200)
      table.string('last_name', 200).notNullable()
      table.string('user_name', 200).notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('phone', 20)
      table.integer('category_id').notNullable()
      table.integer('role_id').notNullable()
      table.integer('degree_id')
      table.string('npi', 12)
      table.integer('specialty_id')
      table.integer('timezone_id')
      table.boolean('notify').defaultTo(false)
      table.boolean('two_step_verification').defaultTo(false)
      table.boolean('is_active').defaultTo(true)
      table.boolean('is_real').defaultTo(true)
      table.string('remember_me_token').nullable()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
