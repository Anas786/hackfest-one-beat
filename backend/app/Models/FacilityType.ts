import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class FacilityType extends BaseModel {

	public static TYPE = {
		CLINIC: 1,
		HOSPITAL: 2
	}

	@column({ isPrimary: true })
	public id: number

	@column()
	public name: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime
}
