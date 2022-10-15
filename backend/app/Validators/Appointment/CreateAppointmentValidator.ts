import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateAppointmentValidator {
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
		patient_id: schema.number(),
		facility_id: schema.number(),
		doctor_id: schema.number(),
		appointment_date: schema.date(),
		appointment_time: schema.string({ trim: true })
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
		'patient_id.required': 'Patient is required',
		'facility_id.required': 'Facility is required',
		'doctor_id.required': 'Doctor is required',
		'appointment_date.required': 'Appointment date is required',
		'appointment_time.required': 'Appointment time is required',
	}
}
