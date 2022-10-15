import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'
import { string } from '@ioc:Adonis/Core/Helpers'
import ApiResponse from 'App/Traits/ApiResponse'
import CreateUserValidator from 'App/Validators/User/CreateUserValidator'

export default class UsersController extends ApiResponse {
    
    public async index(ctx: HttpContextContract) {  
        
        const { paginate, page, limit, sort, order, is_active, role_id, category_id } = ctx.request.qs()
        const id = ctx.request.param('id')

        try {

            if( id ) {

                const user = await User
                .query()
                .preload('role')
                .preload('degree')
                .preload('category')
                .preload('specialty')
                .preload('timezone')
                .where('id', id)
                .firstOrFail()
    
                return this.success(ctx, user)
    
            } else {
    
                if( paginate != null && paginate == '1' || paginate == 1 ) {
                    const users = await User
                    .query()
                    .preload('role')
                    .preload('degree')
                    .preload('category')
                    .preload('specialty')
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
                        role_id != null, 
                        (query) => {
                            query.where('role_id', role_id)
                        },
                        () => {
        
                        }
                    )
                    .if(
                        category_id != null, 
                        (query) => {
                            query.where('category_id', category_id)
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
                    .paginate(page, limit ? limit : Env.get('PAGINATION_LIMIT'))
                    
                    return this.success(ctx, users)
                    
                } else {
                    const users = await User
                    .query()
                    .preload('role')
                    .preload('degree')
                    .preload('category')
                    .preload('specialty')
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
                        role_id != null, 
                        (query) => {
                            query.where('role_id', role_id)
                        },
                        () => {
        
                        }
                    )
                    .if(
                        category_id != null, 
                        (query) => {
                            query.where('category_id', category_id)
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
            phone,
            role_id,
            category_id,
            specialty_id,
            degree_id,
            facility_id,
            timezone_id,
            notify,
            two_step_verification,
            is_active
        } = ctx.request.all()

        try {
            // Validate parameters
            await ctx.request.validate(CreateUserValidator)

            const userName = (user_name != null) ? user_name : string.generateRandom(8)
            const passwordd = (password != null) ? password : '12345678'

            const user = new User()

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
            user.roleId = role_id
            user.categoryId = category_id
            user.facilityId = facility_id
            user.degreeId = degree_id
            user.specialtyId = specialty_id
            user.timezoneId = timezone_id
            user.notify = notify ? notify : false
            user.twoStepVerification = two_step_verification ? two_step_verification : false
            user.isActive = is_active ? is_active : false

            await user.save()

            return this.success(ctx, user.toJSON(), 'User has been created')

        } catch (error) {
            console.log(error)
            return this.error(ctx, error.messages)
        }
    }

}
