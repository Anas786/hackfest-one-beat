import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Admission from 'App/Models/Admission'
import Diagnostic from 'App/Models/Diagnostic'

export default class AdmissionDiagnostic extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public admissionId: number

	@column()
	public diagnosticId: number

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@belongsTo(() => Admission, {
		localKey: 'id',
		foreignKey: 'admissionId',
	})
	public admission: BelongsTo<typeof Admission>

	@manyToMany(() => Diagnostic, {
		localKey: 'id',
		pivotForeignKey: 'admissionId',
		relatedKey: 'id',
		pivotRelatedForeignKey: 'diagnosticId',
		pivotTable: 'admission_diagnostics',
	})
	public diagnostics: ManyToMany<typeof Diagnostic>
}
