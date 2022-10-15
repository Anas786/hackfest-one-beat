import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Appointment from 'App/Models/Appointment'
import Diet from 'App/Models/Diet'
import IvFluid from 'App/Models/IvFluid'

export default class PatientMedicationOrder extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public appointmentId: number

	@column()
	public patientId: number

	@column()
	public dietId: number

	@column()
	public ivFluidId: number

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

	@belongsTo(() => Diet, {
		localKey: 'id',
		foreignKey: 'dietId',
	})
	public diet: BelongsTo<typeof Diet>

	@belongsTo(() => IvFluid, {
		localKey: 'id',
		foreignKey: 'ivFluidId',
	})
	public iv_fluid: BelongsTo<typeof IvFluid>
}
