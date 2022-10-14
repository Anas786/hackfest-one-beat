import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category'

export default class extends BaseSeeder {
	public async run () {
		// Write your database queries inside the run method
		await Category.truncate(true)

		await Category.createMany([
			{
				name: 'Patient',
				code: 'PT'
			},
			{
				name: 'Clinic',
				code: 'CC'
			},
			{
				name: 'Emergency Department',
				code: 'ED'
			},
			{
				name: 'Free Standing Emergency Department',
				code: 'FD'
			},
			{
				name: 'Hospital',
				code: 'HL'
			},
			{
				name: 'Healthcare Center',
				code: 'HC'
			}
		])
	}
}
