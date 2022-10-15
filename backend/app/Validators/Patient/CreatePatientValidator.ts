import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreatePatientValidator {
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
		first_name: schema.string({ trim: true }),
		last_name: schema.string({ trim: true }),
		email: schema.string.optional({ trim: true }),
		nic: schema.string({ trim: true }),
		phone: schema.string({ trim: true }),
		gender: schema.enum(['M', 'F', 'X'] as const),
		dob: schema.date()
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
		'first_name.required': 'First name is required',
		'last_name.required': 'Last name is required',
		'nic.required': 'NIC number is required',
		'phone.required': 'Phone number is required',
		'gender.required': 'Gender is required',
		'dob.required': 'Date of birth is required',
	}
}
