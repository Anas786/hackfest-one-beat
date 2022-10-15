import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Appointment from 'App/Models/Appointment'
import User from 'App/Models/User'
import PatientSpecialtyConsultConsult from './PatientSpecialtyConsultConsult'

export default class PatientSpecialtyConsult extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public appointmentId: number

	@column()
	public patientId: number

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

	@hasMany(() => PatientSpecialtyConsultConsult, {
		localKey: 'id',
		foreignKey: 'patientSpecialtyConsultId',
	})
	public consults: HasMany<typeof PatientSpecialtyConsultConsult>
}
