import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'

export default class Category extends BaseModel {

	public static CATEGORY = {
		PATIENT: 1,
		CLINIC: 2,
		EMERGENCY_DEPARTMENT: 3,
		FREE_STANDING_EMERGENCY_DEPARTMENT: 4,
		HOSPITAL: 5,
		HEALTHCARE_CENTER: 6
	}

	@column({ isPrimary: true })
	public id: number

	@column()
	public name: string

	@column()
	public code: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@manyToMany(() => Role, {
		localKey: 'id',
		pivotForeignKey: 'categoryId',
		relatedKey: 'id',
		pivotRelatedForeignKey: 'roleId',
		pivotTable: 'category_roles',
	})
	public roles: ManyToMany<typeof Role>
}
