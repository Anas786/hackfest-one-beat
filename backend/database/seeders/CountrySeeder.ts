import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Country from 'App/Models/Country';
import axios from 'axios';

export default class extends BaseSeeder {
	public async run () {
		// Write your database queries inside the run method
		await Country.truncate(true)

		await axios.get('https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries.json')
		.then(async(countries: any) => {

			let countriesObj = countries.data

			// handle success
			for( var i in countriesObj ) {
				let country = new Country()

				country.name = countriesObj[i].name
				country.iso2 = countriesObj[i].iso2
				country.iso3 = countriesObj[i].iso3
				country.phoneCode = countriesObj[i].phone_code
				country.capital = countriesObj[i].capital
				country.currency = countriesObj[i].currency
				country.currencyName = countriesObj[i].currency_name
				country.currencySymbol = countriesObj[i].currency_symbol
				country.native = countriesObj[i].native
				country.emoji = countriesObj[i].emoji
				country.emojiU = countriesObj[i].emoji_u

				await country.save()
			}
		})
		.catch((error: any) => {
			// handle error
			console.log(error);
		});
	}
}
