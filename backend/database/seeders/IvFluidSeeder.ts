import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import IvFluid from 'App/Models/IvFluid'

export default class extends BaseSeeder {
	public async run () {
		// Write your database queries inside the run method
		await IvFluid.truncate(true)

		await IvFluid.createMany([
			{
				name: 'Heplock'
			},
			{
				name: 'KVO'
			},
			{
				name: 'Hospital Physician to Order'
			},
		])
	}
}
