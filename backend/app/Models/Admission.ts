import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Appointment from 'App/Models/Appointment'
import Facility from 'App/Models/Facility'
import Transportation from 'App/Models/Transportation'
import BedType from 'App/Models/BedType'

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
	public appointmentId: number

	@column()
	public referralFacilityId: number

	@column()
	public facilityId: number

	@column()
	public transportationId?: number

	@column()
	public bedTypeId?: number

	@column()
	public eta: string

	@column()
	public status: number

	@column()
	public notes: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@belongsTo(() => User, {
		localKey: 'id',
		foreignKey: 'patientId',
	})
	public patient: BelongsTo<typeof User>

	@belongsTo(() => Appointment, {
		localKey: 'id',
		foreignKey: 'appointmentId',
	})
	public appointment: BelongsTo<typeof Appointment>

	@belongsTo(() => Facility, {
		localKey: 'id',
		foreignKey: 'facilityId',
	})
	public facility: BelongsTo<typeof Facility>

	@belongsTo(() => Facility, {
		localKey: 'id',
		foreignKey: 'referralFacilityId',
	})
	public referral_facility: BelongsTo<typeof Facility>

	@belongsTo(() => Transportation, {
		localKey: 'id',
		foreignKey: 'facilityId',
	})
	public transportation: BelongsTo<typeof Transportation>

	@belongsTo(() => BedType, {
		localKey: 'id',
		foreignKey: 'bedTypeId',
	})
	public bed_type: BelongsTo<typeof BedType>
}
