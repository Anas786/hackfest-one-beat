import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Facility from 'App/Models/Facility'

export default class Appointment extends BaseModel {

	public static STATUS = {
		PENDING: 1,
		CONFIRMED: 2,
		REJECTED: 3,
		CANCELLED: 4,
		COMPLETED: 5
	}

	@column({ isPrimary: true })
	public id: number
	
	@column()
	public code: string
	
	@column()
	public userId: number
	
	@column()
	public facilityId: number
	
	@column()
	public appointmentDate: Date
	
	@column()
	public appointmentTime: string
	
	@column()
	public doctorId: number
	
	@column()
	public status: number

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@belongsTo(() => User, {
		localKey: 'id',
		foreignKey: 'userId',
	})
	public patient: BelongsTo<typeof User>

	@belongsTo(() => User, {
		localKey: 'id',
		foreignKey: 'doctorId',
	})
	public doctor: BelongsTo<typeof User>

	@belongsTo(() => Facility, {
		localKey: 'id',
		foreignKey: 'facilityId',
	})
	public facility: BelongsTo<typeof Facility>
}
