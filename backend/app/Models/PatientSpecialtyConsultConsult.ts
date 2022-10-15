import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Consult from 'App/Models/Consult'
import PatientSpecialtyConsult from 'App/Models/PatientSpecialtyConsult'

export default class PatientSpecialtyConsultConsult extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public patientSpecialtyConsultId: number

	@column()
	public consultId: number

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@belongsTo(() => Consult, {
		localKey: 'id',
		foreignKey: 'consultId',
	})
	public consult: BelongsTo<typeof Consult>

	@belongsTo(() => PatientSpecialtyConsult, {
		localKey: 'id',
		foreignKey: 'patientSpecialtyConsultId',
	})
	public specialty_consult: BelongsTo<typeof PatientSpecialtyConsult>
}
