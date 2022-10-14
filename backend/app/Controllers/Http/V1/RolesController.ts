import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import ApiResponse from 'App/Traits/ApiResponse'
import Role from 'App/Models/Role'

export default class RolesController extends ApiResponse {

    public async index(ctx: HttpContextContract) {  
        
        const { paginate, page, limit, sort, order, category_id } = ctx.request.qs()
        const id = ctx.request.param('id')

        try {

            if( id ) {

                const role = await Role
                .query()
                .where('id', id)
                .firstOrFail()
    
                return this.success(ctx, role)
    
            } else {
    
                if( paginate != null && paginate == '1' || paginate == 1 ) {
                    const roles = await Role
                    .query()
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
                            query.orderBy('name', 'asc')
                        }
                    )
                    .paginate(page, limit ? limit : Env.get('PAGINATION_LIMIT'))
                    
                    return this.success(ctx, roles)
                    
                } else {
                    const roles = await Role
                    .query()
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
                            query.orderBy('name', 'asc')
                        }
                    )
    
                    return this.success(ctx, roles)
                }
            }

        } catch(error) {
            console.log(error)
            return this.error(ctx, error)
        }
        
    }

}
