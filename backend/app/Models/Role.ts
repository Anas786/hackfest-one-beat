import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Role extends BaseModel {

	public static ROLE = {
		ADMIN: 1,
		ADMISSION_DESK_USER: 2,
		BED_FLOW_COORDINATOR: 3,
		PHYSICIAN: 4,
		PHYSICIAN_ASSISTANT: 5,
		ONEBEAT_SUPPORT: 6,
		REGISTERED_NURSE: 7,
		STAFF: 8,
		SELF_ACCEPTING_PHYSICIAN: 9,
		SUB_ADMINISTRATOR: 10,
		USER: 11
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
