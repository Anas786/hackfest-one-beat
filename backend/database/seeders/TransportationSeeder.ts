import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Transportation from 'App/Models/Transportation'

export default class extends BaseSeeder {
	public async run () {
		// Write your database queries inside the run method

		await Transportation.truncate(true)

		await Transportation.createMany([
			{
				name: 'Ambulance',
			},
			{
				name: 'Personal Transportation',
			},
			{
				name: 'Air Medical Transport',
			},
		])	
	}
}
