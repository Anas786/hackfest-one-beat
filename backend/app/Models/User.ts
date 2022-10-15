import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Role from 'App/Models/Role'
import Category from 'App/Models/Category'
import Degree from 'App/Models/Degree'
import Specialty from 'App/Models/Specialty'
import Timezone from 'App/Models/Timezone'
import Facility from 'App/Models/Facility'
import PatientMedicalHistory from 'App/Models/PatientMedicalHistory'
import PatientMedicationOrder from 'App/Models/PatientMedicationOrder'
import PatientDiagnosticOrder from 'App/Models/PatientDiagnosticOrder'
import PatientSpecialtyConsult from 'App/Models/PatientSpecialtyConsult'
import Appointment from 'App/Models/Appointment'

export default class User extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public mrNumber?: string

	@column({ 
		serialize: (value) => {
			if( value != null ) {
				return `${ value[0] }${ new Array(value.length).join('*') }`
			}
			return value
		} 
	})
	public firstName: string

	@column({ 
		serialize: (value) => {
			if( value != null ) {
				return `${ value[0] }${ new Array(value.length).join('*') }`
			}
			return value
		} 
	})
	public middleName?: string

	@column({ 
		serialize: (value) => {
			if( value != null ) {
				return `${ value[0] }${ new Array(value.length).join('*') }`
			}
			return value
		} 
	})
	public lastName: string

	@column({ 
		serialize: (value) => {
			if( value != null ) {
				const [name, domain] = value.split('@');
				return `${ name[0] }${ new Array(name.length).join('*') }@${ domain }`
			}
			return value
		} 
	})
	public email: string

	@column()
	public userName: string

	@column({ serializeAs: null })
	public password: string

	@column()
	public nic?: string

	@column()
	public phone?: string

	@column()
	public categoryId: number

	@column()
	public facilityId?: number

	@column({ 
		serialize: (value) => {
			if( value != null ) {
				return `${ new Array(value.length+1).join('*') }`
			}
			return value
		} 
	})
	public gender: string

	@column({ 
		serialize: (value) => {
			if( value != null ) {
				return `${ new Array(6).join('*') }`
			}
			return value
		} 
	})
	public dob: Date

	@column()
	public roleId: number

	@column()
	public degreeId?: number

	@column()
	public specialtyId?: number

	@column()
	public timezoneId?: number

	@column()
	public notify?: boolean

	@column()
	public twoStepVerification?: boolean

	@column()
	public isActive?: boolean

	@column()
	public rememberMeToken?: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	@beforeSave()
	public static async hashPassword (User: User) {
		if (User.$dirty.password) {
			User.password = await Hash.make(User.password)
		}
	}

	@belongsTo(() => Category, {
		localKey: 'id',
		foreignKey: 'categoryId',
	})
	public category: BelongsTo<typeof Category>

	@belongsTo(() => Role, {
		localKey: 'id',
		foreignKey: 'roleId',
	})
	public role: BelongsTo<typeof Role>

	@belongsTo(() => Degree, {
		localKey: 'id',
		foreignKey: 'degreeId',
	})
	public degree: BelongsTo<typeof Degree>

	@belongsTo(() => Facility, {
		localKey: 'id',
		foreignKey: 'facilityId',
	})
	public facility: BelongsTo<typeof Facility>

	@belongsTo(() => Specialty, {
		localKey: 'id',
		foreignKey: 'specialtyId',
	})
	public specialty: BelongsTo<typeof Specialty>

	@belongsTo(() => Timezone, {
		localKey: 'id',
		foreignKey: 'timezoneId',
	})
	public timezone: BelongsTo<typeof Timezone>

	@hasMany(() => PatientMedicalHistory, {
		localKey: 'id',
		foreignKey: 'patientId',
	})
	public medical_histories: HasMany<typeof PatientMedicalHistory>

	@hasMany(() => PatientMedicationOrder, {
		localKey: 'id',
		foreignKey: 'patientId',
	})
	public medication_orders: HasMany<typeof PatientMedicationOrder>

	@hasMany(() => PatientDiagnosticOrder, {
		localKey: 'id',
		foreignKey: 'patientId',
	})
	public diagnostic_orders: HasMany<typeof PatientDiagnosticOrder>

	@hasMany(() => PatientSpecialtyConsult, {
		localKey: 'id',
		foreignKey: 'patientId',
	})
	public specialty_consults: HasMany<typeof PatientSpecialtyConsult>

	@hasMany(() => Appointment, {
		localKey: 'id',
		foreignKey: 'userId',
	})
	public appointments: HasMany<typeof Appointment>
}
