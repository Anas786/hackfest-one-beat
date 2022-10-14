import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Degree from 'App/Models/Degree'

export default class extends BaseSeeder {
	public async run () {
		// Write your database queries inside the run method
		await Degree.truncate(true)

		await Degree.createMany([
			{
				name: 'Doctor of Osteopathic Medicine',
				code: 'DO'
			},
			{
				name: 'Doctor of Medicine',
				code: 'MD'
			},
			{
				name: 'Nurse Practitioner',
				code: 'NP'
			},
			{
				name: 'Physician Assistant',
				code: 'PA'
			},
		])
	}
}
