import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import BloodTest from 'App/Models/BloodTest'
import PatientDiagnosticOrder from 'App/Models/PatientDiagnosticOrder'

export default class PatientDiagnosticOrderBloodTest extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public patientDiagnosticOrderId: number

	@column()
	public bloodTestId: number

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@belongsTo(() => BloodTest, {
		localKey: 'id',
		foreignKey: 'bloodTestId',
	})
	public blood_test: BelongsTo<typeof BloodTest>

	@belongsTo(() => PatientDiagnosticOrder, {
		localKey: 'id',
		foreignKey: 'patientDiagnosticOrderId',
	})
	public diagnostic_order: BelongsTo<typeof PatientDiagnosticOrder>
}
