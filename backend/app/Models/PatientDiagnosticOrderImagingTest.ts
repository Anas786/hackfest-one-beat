import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import ImagingTest from 'App/Models/ImagingTest'
import PatientDiagnosticOrder from 'App/Models/PatientDiagnosticOrder'

export default class PatientDiagnosticOrderImagingTest extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public patientDiagnosticOrderId: number

	@column()
	public imagingTestId: number

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@belongsTo(() => ImagingTest, {
		localKey: 'id',
		foreignKey: 'imagingTestId',
	})
	public imaging_test: BelongsTo<typeof ImagingTest>

	@belongsTo(() => PatientDiagnosticOrder, {
		localKey: 'id',
		foreignKey: 'patientDiagnosticOrderId',
	})
	public diagnostic_order: BelongsTo<typeof PatientDiagnosticOrder>
}
