import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ImagingTest from 'App/Models/ImagingTest'

export default class extends BaseSeeder {
	public async run () {
		// Write your database queries inside the run method
		await ImagingTest.truncate(true)

		await ImagingTest.createMany([
			{
				name: 'X-Rays',
			},
			{
				name: 'US',
			},
			{
				name: 'CT',
			},
			{
				name: 'MRI',
			},
			{
				name: 'EKG',
			},
		])	
	}
}
