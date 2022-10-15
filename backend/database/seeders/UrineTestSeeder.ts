import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UrineTest from 'App/Models/UrineTest'

export default class extends BaseSeeder {
	public async run () {
		// Write your database queries inside the run method
		await UrineTest.truncate(true)

		await UrineTest.createMany([
			{
				name: 'UA',
			},
			{
				name: 'U&S',
			},
		])	
	}
}
