import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Consult from 'App/Models/Consult'

export default class extends BaseSeeder {
	public async run () {
		// Write your database queries inside the run method
		await Consult.truncate(true)

		await Consult.createMany([
			{
				name: 'Cardiology',
			},
			{
				name: 'Pulmonology',
			},
			{
				name: 'Nephrology',
			},
			{
				name: 'Neurology',
			},
			{
				name: 'Neurosurgery',
			},
		])
	}
}
