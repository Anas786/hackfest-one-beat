import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class extends BaseSeeder {
	public async run () {
		// Write your database queries inside the run method
		await Role.truncate(true)

		await Role.createMany([
			{
				name: 'Administrator',
				code: 'AR'
			},
			{
				name: 'Admission Desk User',
				code: 'AK'
			},
			{
				name: 'Bed Flow Coordinator',
				code: 'BR'
			},
			{
				name: 'Physician',
				code: 'PN'
			},
			{
				name: 'Physician Assistant',
				code: 'PA'
			},
			{
				name: 'OneBeat Support',
				code: 'OS'
			},
			{
				name: 'Registered Nurse',
				code: 'RE'
			},
			{
				name: 'Staff',
				code: 'SF'
			},
			{
				name: 'Self-accepting Physician',
				code: 'SN'
			},
			{
				name: 'Sub administrator',
				code: 'SR'
			},
			{
				name: 'User',
				code: 'UR'
			},
		])
	}
}
