import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category'
import Role from 'App/Models/Role'

export default class extends BaseSeeder {
	public async run () {
		// Write your database queries inside the run method
		await Role.truncate(true)

		await Role.createMany([
			{
				name: 'Administrator',
				code: 'AR',
				categoryId: Category.CATEGORY.AU
			},
			{
				name: 'Admission Desk User',
				code: 'AK',
				categoryId: Category.CATEGORY.HL
			},
			{
				name: 'Administrator',
				code: 'AR',
				categoryId: Category.CATEGORY.CC
			},
			{
				name: 'Administrator',
				code: 'AR',
				categoryId: Category.CATEGORY.ED
			},
			{
				name: 'Administrator',
				code: 'AR',
				categoryId: Category.CATEGORY.FD
			},
			{
				name: 'Administrator',
				code: 'AR',
				categoryId: Category.CATEGORY.HL
			},
			{
				name: 'Administrator',
				code: 'AR',
				categoryId: Category.CATEGORY.HC
			},
			{
				name: 'Bed Flow Coordinator',
				code: 'BR',
				categoryId: Category.CATEGORY.HL
			},
			{
				name: 'Physician',
				code: 'PN',
				categoryId: Category.CATEGORY.HL
			},
			{
				name: 'Physician Assistant',
				code: 'PA',
				categoryId: Category.CATEGORY.HL
			},
			{
				name: 'Quicare Support',
				code: 'QT',
				categoryId: Category.CATEGORY.HL
			},
			{
				name: 'Registered Nurse',
				code: 'RE',
				categoryId: Category.CATEGORY.HL
			},
			{
				name: 'Staff',
				code: 'SF',
				categoryId: Category.CATEGORY.HL
			},
			{
				name: 'Self-accepting Physician',
				code: 'SN',
				categoryId: Category.CATEGORY.HL
			},
			{
				name: 'Sub administrator',
				code: 'SR',
				categoryId: Category.CATEGORY.HL
			},
			{
				name: 'User',
				code: 'UR',
				categoryId: Category.CATEGORY.HL
			},
		])
	}
}
