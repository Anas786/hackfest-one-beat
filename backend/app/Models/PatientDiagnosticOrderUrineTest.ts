import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import UrineTest from 'App/Models/UrineTest'
import PatientDiagnosticOrder from 'App/Models/PatientDiagnosticOrder'

export default class PatientDiagnosticOrderUrineTest extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public patientDiagnosticOrderId: number

	@column()
	public urineTestId: number

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@belongsTo(() => UrineTest, {
		localKey: 'id',
		foreignKey: 'urineTestId',
	})
	public urine_test: BelongsTo<typeof UrineTest>

	@belongsTo(() => PatientDiagnosticOrder, {
		localKey: 'id',
		foreignKey: 'patientDiagnosticOrderId',
	})
	public diagnostic_order: BelongsTo<typeof PatientDiagnosticOrder>
}
