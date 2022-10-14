import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category'
import User from 'App/Models/User'

export default class extends BaseSeeder {
	public async run () {
		// Write your database queries inside the run method
		await User.truncate(true)

		await User.createMany([
			{
				firstName: 'Admin',
				lastName: 'User',
				userName: 'admin',
				email: 'admin@user.com',
				password: '12345678',
				roleId: 1,
				categoryId: Category.CATEGORY.HL,
				isActive: true
			}
		])
	}
}
