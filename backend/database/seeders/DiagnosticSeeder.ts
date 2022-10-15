import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Diagnostic from 'App/Models/Diagnostic'

export default class extends BaseSeeder {
	public async run () {
		// Write your database queries inside the run method
		await Diagnostic.truncate(true)

		await Diagnostic.createMany([
			{
				name: 'Back Pain'
			},
			{
				name: 'Chest Pain'
			},
			{
				name: 'Dengue'
			},
		])
	}
}
