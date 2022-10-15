import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import BedType from 'App/Models/BedType'

export default class extends BaseSeeder {
	public async run () {

		await BedType.truncate(true)

		await BedType.createMany([
			{
				name: 'Pediatrics Bed',
			},
			{
				name: 'Intensive Care Unit',
			},
			{
				name: 'Intermediate Medical Unit',
			},
		])	
	}
}
