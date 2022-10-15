import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Appointment from 'App/Models/Appointment'
import User from 'App/Models/User'
import PatientDiagnosticOrderBloodTest from 'App/Models/PatientDiagnosticOrderBloodTest'
import PatientDiagnosticOrderUrineTest from 'App/Models/PatientDiagnosticOrderUrineTest'
import PatientDiagnosticOrderImagingTest from 'App/Models/PatientDiagnosticOrderImagingTest'

export default class PatientDiagnosticOrder extends BaseModel {
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

	@hasMany(() => PatientDiagnosticOrderBloodTest, {
		localKey: 'id',
		foreignKey: 'patientDiagnosticOrderId',
	})
	public blood_tests: HasMany<typeof PatientDiagnosticOrderBloodTest>

	@hasMany(() => PatientDiagnosticOrderUrineTest, {
		localKey: 'id',
		foreignKey: 'patientDiagnosticOrderId',
	})
	public urine_tests: HasMany<typeof PatientDiagnosticOrderUrineTest>

	@hasMany(() => PatientDiagnosticOrderImagingTest, {
		localKey: 'id',
		foreignKey: 'patientDiagnosticOrderId',
	})
	public imaging_tests: HasMany<typeof PatientDiagnosticOrderImagingTest>
}
