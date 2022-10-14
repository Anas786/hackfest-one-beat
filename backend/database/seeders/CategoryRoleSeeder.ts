import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category'
import CategoryRole from 'App/Models/CategoryRole'
import Role from 'App/Models/Role'

export default class extends BaseSeeder {
	public async run () {
		// Write your database queries inside the run method
		await CategoryRole.truncate(true)

		await CategoryRole.createMany([
			{
				roleId: Role.ROLE.ADMIN,
				categoryId: Category.CATEGORY.CLINIC
			},
			{
				roleId: Role.ROLE.ADMISSION_DESK_USER,
				categoryId: Category.CATEGORY.CLINIC
			},
			{
				roleId: Role.ROLE.ADMIN,
				categoryId: Category.CATEGORY.EMERGENCY_DEPARTMENT
			},
			{
				roleId: Role.ROLE.ADMISSION_DESK_USER,
				categoryId: Category.CATEGORY.EMERGENCY_DEPARTMENT
			},
			{
				roleId: Role.ROLE.STAFF,
				categoryId: Category.CATEGORY.EMERGENCY_DEPARTMENT
			},
			{
				roleId: Role.ROLE.ADMIN,
				categoryId: Category.CATEGORY.HOSPITAL
			},
			{
				roleId: Role.ROLE.ADMISSION_DESK_USER,
				categoryId: Category.CATEGORY.HOSPITAL
			},
			{
				roleId: Role.ROLE.PHYSICIAN,
				categoryId: Category.CATEGORY.HOSPITAL
			},
			{
				roleId: Role.ROLE.PHYSICIAN_ASSISTANT,
				categoryId: Category.CATEGORY.HOSPITAL
			},
			{
				roleId: Role.ROLE.STAFF,
				categoryId: Category.CATEGORY.HOSPITAL
			}
		])
	}
}
