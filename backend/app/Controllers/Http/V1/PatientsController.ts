import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import { string } from '@ioc:Adonis/Core/Helpers'
import User from 'App/Models/User'
import ApiResponse from 'App/Traits/ApiResponse'
import Role from 'App/Models/Role'
import Category from 'App/Models/Category'
import CreatePatientValidator from 'App/Validators/Patient/CreatePatientValidator'
import GeneralHelper from 'App/Helpers/GeneralHelper'

export default class PatientsController extends ApiResponse {

    public async index(ctx: HttpContextContract) {  
        
        const { paginate, page, limit, sort, order, is_active, gender, nic, mr_number } = ctx.request.qs()
        const id = ctx.request.param('id')

        try {

            if( id ) {

                const user = await User
                    .query()
                    .preload('role')
                    .preload('category')
                    .preload('timezone')
                    .preload('medical_histories')
                    .preload('medication_orders')
                    .preload('diagnostic_orders', (diagnosticOrdersQuery) => {
                        diagnosticOrdersQuery
                            .preload('blood_tests')
                            .preload('urine_tests')
                            .preload('imaging_tests')
                    })
                    .preload('specialty_consults', (specialtyConsultsQuery) => {
                        specialtyConsultsQuery
                            .preload('consults')
                    })
                    .preload('appointments')
                    .where('id', id)
                    .where('role_id', Role.ROLE.USER)
                    .where('category_id', Category.CATEGORY.PATIENT)
                    .firstOrFail()
    
                return this.success(ctx, user)
    
            } else {
    
                if( paginate != null && paginate == '1' || paginate == 1 ) {
                    const users = await User
                    .query()
                    .preload('role')
                    .preload('category')
                    .preload('timezone')
                    .if(
                        is_active != null, 
                        (query) => {
                            query.where('is_active', is_active)
                        },
                        () => {
        
                        }
                    )
                    .if(
                        gender != null, 
                        (query) => {
                            query.where('gender', gender)
                        },
                        () => {
        
                        }
                    )
                    .if(
                        nic != null, 
                        (query) => {
                            query.where('nic', nic)
                        },
                        () => {
        
                        }
                    )
                    .if(
                        mr_number != null, 
                        (query) => {
                            query.where('mr_number', mr_number)
                        },
                        () => {
        
                        }
                    )
                    .if(
                        sort != null,
                        (query) => {
                            query.orderBy(sort, order)
                        }, 
                        (query) => {
                            query.orderBy('created_at', 'desc')
                        }
                    )
                    .where('role_id', Role.ROLE.USER)
                    .where('category_id', Category.CATEGORY.PATIENT)
                    .paginate(page, limit ? limit : Env.get('PAGINATION_LIMIT'))
                    
                    return this.success(ctx, users)
                    
                } else {
                    const users = await User
                    .query()
                    .preload('role')
                    .preload('category')
                    .preload('timezone')
                    .if(
                        is_active != null, 
                        (query) => {
                            query.where('is_active', is_active)
                        },
                        () => {
        
                        }
                    )
                    .if(
                        gender != null, 
                        (query) => {
                            query.where('gender', gender)
                        },
                        () => {
        
                        }
                    )
                    .if(
                        nic != null, 
                        (query) => {
                            query.where('nic', nic)
                        },
                        () => {
        
                        }
                    )
                    .if(
                        mr_number != null, 
                        (query) => {
                            query.where('mr_number', mr_number)
                        },
                        () => {
        
                        }
                    )
                    .if(
                        sort != null,
                        (query) => {
                            query.orderBy(sort, order)
                        }, 
                        (query) => {
                            query.orderBy('created_at', 'desc')
                        }
                    )
                    .if(
                        sort != null,
                        (query) => {
                            query.orderBy(sort, order)
                        }, 
                        (query) => {
                            query.orderBy('created_at', 'desc')
                        }
                    )
                    .where('role_id', Role.ROLE.USER)
                    .where('category_id', Category.CATEGORY.PATIENT)
    
                    return this.success(ctx, users)
                }
            }

        } catch(error) {
            console.log(error)
            return this.error(ctx, error)
        }
        
    }

    public async create(ctx: HttpContextContract) {
        const { 
            first_name,
            middle_name,
            last_name,
            user_name,
            password,
            email,
            nic,
            dob,
            gender,
            phone
        } = ctx.request.all()

        try {
            // Validate parameters
            await ctx.request.validate(CreatePatientValidator)

            const userName = (user_name != null) ? user_name : string.generateRandom(8)
            const passwordd = (password != null) ? password : '12345678'
            const mr = GeneralHelper.generateMrNumber()

            const user = new User()

            user.mrNumber = mr
            user.firstName = first_name
            user.middleName = middle_name
            user.lastName = last_name
            user.userName = userName
            user.password = passwordd
            user.email = email
            user.phone = phone
            user.nic = nic
            user.gender = gender
            user.dob = dob
            user.roleId = Role.ROLE.USER
            user.categoryId = Category.CATEGORY.PATIENT
            user.isActive = true

            await user.save()

            return this.success(ctx, user.toJSON(), 'Patient has been created')

        } catch (error) {
            console.log(error)
            return this.error(ctx, error.messages)
        }
    }

}
