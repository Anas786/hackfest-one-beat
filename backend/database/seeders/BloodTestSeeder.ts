import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import BloodTest from 'App/Models/BloodTest'

export default class extends BaseSeeder {
	public async run () {
		// Write your database queries inside the run method

		await BloodTest.truncate(true)

		await BloodTest.createMany([
			{
				name: 'CBC',
			},
			{
				name: 'BMP',
			},
			{
				name: 'LFT',
			},
		])	
	}
}
