import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Category extends BaseModel {

	public static CATEGORY = {
		AU: 1,
		CC: 2,
		ED: 3,
		FD: 4,
		HL: 5,
		HC: 6
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
}
