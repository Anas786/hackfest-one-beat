import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Specialty from 'App/Models/Specialty'

export default class extends BaseSeeder {
	public async run () {
		// Write your database queries inside the run method
		await Specialty.truncate(true)

		await Specialty.createMany([
			{
				name: 'Anaesthesia'
			},
			{
				name: 'Allergy and Immunology'
			},
			{
				name: 'Cardiovascular surgery'
			},
			{
				name: 'Cardiology'
			},
			{
				name: 'Dietetics'
			},
			{
				name: 'Dermatology'
			},
			{
				name: 'Family Medicine'
			},
		])
	}
}
