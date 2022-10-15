import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'
import ApiResponse from 'App/Traits/ApiResponse'
import Role from 'App/Models/Role'

export default class DoctorsController extends ApiResponse {

    public async index(ctx: HttpContextContract) {  
        
        const { paginate, page, limit, sort, order, is_active, facility_id } = ctx.request.qs()
        const id = ctx.request.param('id')

        try {

            if( id ) {

                const user = await User
                    .query()
                    .preload('role')
                    .preload('category')
                    .preload('specialty')
                    .preload('degree')
                    .preload('timezone')
                    .where('id', id)
                    .where('role_id', Role.ROLE.PHYSICIAN)
                    .firstOrFail()
    
                return this.success(ctx, user)
    
            } else {
    
                if( paginate != null && paginate == '1' || paginate == 1 ) {
                    const users = await User
                    .query()
                    .preload('role')
                    .preload('category')
                    .preload('specialty')
                    .preload('degree')
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
                        facility_id != null, 
                        (query) => {
                            query.where('facility_id', facility_id)
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
                    .where('role_id', Role.ROLE.PHYSICIAN)
                    .paginate(page, limit ? limit : Env.get('PAGINATION_LIMIT'))
                    
                    return this.success(ctx, users)
                    
                } else {
                    const users = await User
                    .query()
                    .preload('role')
                    .preload('category')
                    .preload('specialty')
                    .preload('degree')
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
                        facility_id != null, 
                        (query) => {
                            query.where('facility_id', facility_id)
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
    
                    return this.success(ctx, users)
                }
            }

        } catch(error) {
            console.log(error)
            return this.error(ctx, error)
        }
        
    }

    

}
