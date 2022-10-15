import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateFacilityValidator {
	constructor(protected ctx: HttpContextContract) {}

	/*
	* Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
	*
	* For example:
	* 1. The username must be of data type string. But then also, it should
	*    not contain special characters or numbers.
	*    ```
	*     schema.string({}, [ rules.alpha() ])
	*    ```
	*
	* 2. The email must be of data type string, formatted as a valid
	*    email. But also, not used by any other user.
	*    ```
	*     schema.string({}, [
	*       rules.email(),
	*       rules.unique({ table: 'users', column: 'email' }),
	*     ])
	*    ```
	*/
	public schema = schema.create({
		name: schema.string({ trim: true }),
		address: schema.string({ trim: true }),
		address2: schema.string.optional({ trim: true }),
		city: schema.string({ trim: true }),
		state: schema.string({ trim: true }),
		zip: schema.string.optional({ trim: true }),
		country_id: schema.string({ trim: true }),
		latitude: schema.number.optional(),
		longitude: schema.number.optional(),
		facility_type_id: schema.number( [rules.exists({table: 'facility_types', column: 'id'})] ),
		phone: schema.string.optional({ trim: true }),
		email: schema.string.optional({ trim: true }),
		representative_name: schema.string.optional({ trim: true }),
		representative_email: schema.string.optional({ trim: true }),
		representative_phone: schema.string.optional({ trim: true }),
	})

	/**
	 * Custom messages for validation failures. You can make use of dot notation `(.)`
	 * for targeting nested fields and array expressions `(*)` for targeting all
	 * children of an array. For example:
	 *
	 * {
	 *   'profile.username.required': 'Username is required',
	 *   'scores.*.number': 'Define scores as valid numbers'
	 * }
	 *
	 */
	public messages: CustomMessages = {
		'name.required': 'Facility name is required',
		'addres.required': 'Facility address line 1 is required',
		'city.required': 'City is required',
		'state.required': 'State is required',
		'country_id.required': 'Country is required',
		'facility_type_id.required': 'Facility type is required'
	}
}
