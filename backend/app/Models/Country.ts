import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Country extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public name: string

	@column()
	public iso2: string

	@column()
	public iso3: string

	@column()
	public phoneCode: string

	@column()
	public capital: string

	@column()
	public currency: string

	@column()
	public currencyName: string

	@column()
	public currencySymbol: string

	@column()
	public native: string

	@column()
	public emoji: string

	@column()
	public emojiU: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime
}
