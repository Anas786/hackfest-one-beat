import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Diet from 'App/Models/Diet'

export default class extends BaseSeeder {
	public async run () {
		// Write your database queries inside the run method
		await Diet.truncate(true)

		await Diet.createMany([
			{
				name: 'NPO'
			},
			{
				name: 'Clear Liquids'
			},
			{
				name: 'Regular'
			},
		])
	}
}
