import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Admission extends BaseModel {

	public static STATUS = {
		INITIATED: 1,
		APPROVED: 2,
		REJECTED: 3,
		PATIENT_ARRIVED: 4,
		CANCELLED: 5,
		DISCHARGED: 6
	}

	@column({ isPrimary: true })
	public id: number

	@column()
	public code: string

	@column()
	public patientId: number

	@column()
	public facilityId: number

	@column()
	public transportationId?: number

	@column()
	public bedTypeId?: number

	@column()
	public eta: number

	@column()
	public status: number

	@column()
	public notes: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime
}
