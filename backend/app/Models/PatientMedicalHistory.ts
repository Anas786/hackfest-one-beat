import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Appointment from 'App/Models/Appointment'

export default class PatientMedicalHistory extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public appointmentId: number

	@column()
	public patientId: number

	@column()
	public temperature: number

	@column()
	public glucose: number

	@column()
	public bpSystolic: number

	@column()
	public bpDiastolic: number

	@column()
	public pulse: number

	@column()
	public o2Level: number

	@column()
	public otherAllergies: string

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
}
