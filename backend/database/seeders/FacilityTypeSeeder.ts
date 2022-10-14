import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import FacilityType from 'App/Models/FacilityType'

export default class extends BaseSeeder {
    public async run () {
      // Write your database queries inside the run method
	  await FacilityType.truncate(true)

		await FacilityType.createMany([
			{
				name: 'Clinic'
			},
			{
				name: 'Hospital'
			},
		])
    }
}
