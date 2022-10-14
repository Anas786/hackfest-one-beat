import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Category from 'App/Models/Category'
import Role from 'App/Models/Role'

export default class CategoryRole extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public categoryId: number

	@column()
	public roleId: number

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@belongsTo(() => Category, {
		localKey: 'id',
		foreignKey: 'categoryId',
	})
	public category: BelongsTo<typeof Category>

	@belongsTo(() => Role, {
		localKey: 'id',
		foreignKey: 'roleId',
	})
	public role: BelongsTo<typeof Role>
}
