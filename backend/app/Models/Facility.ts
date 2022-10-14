import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Facility extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public name: string

	@column()
	public address: string

	@column()
	public address2: string

	@column()
	public zip?: string

	@column()
	public city: string

	@column()
	public state: string

	@column()
	public countryId: string

	@column()
	public latitude?: string

	@column()
	public longitude?: string

	@column()
	public facilityTypeId: string

	@column()
	public phone?: string

	@column()
	public email?: string

	@column()
	public representativeName?: string

	@column()
	public representativePhone?: string

	@column()
	public representativeEmail?: string

	@column()
	public isActive: boolean

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime
}
