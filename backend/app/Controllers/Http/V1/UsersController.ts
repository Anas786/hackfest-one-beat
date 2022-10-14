import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'
import ApiResponse from 'App/Traits/ApiResponse'

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

}
