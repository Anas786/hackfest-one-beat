import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import ApiResponse from 'App/Traits/ApiResponse'
import Category from 'App/Models/Category'
import CategoryRole from 'App/Models/CategoryRole'

export default class CategoriesController extends ApiResponse {

    public async index(ctx: HttpContextContract) {  
        
        const { paginate, page, limit, sort, order } = ctx.request.qs()
        const id = ctx.request.param('id')

        try {

            if( id ) {

                const category = await Category
                .query()
                .where('id', id)
                .firstOrFail()
    
                this.success(ctx, category)
    
            } else {
    
                if( paginate != null && paginate == '1' || paginate == 1 ) {
                    const categories = await Category
                    .query()
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
                    
                    return this.success(ctx, categories)
                    
                } else {
                    const categories = await Category
                    .query()
                    .if(
                        sort != null,
                        (query) => {
                            query.orderBy(sort, order)
                        }, 
                        (query) => {
                            query.orderBy('name', 'asc')
                        }
                    )
    
                    return this.success(ctx, categories)
                }
            }

        } catch(error) {
            console.log(error)
            return this.error(ctx, error)
        }
        
    }

    public async roles(ctx: HttpContextContract) {  
        
        const { paginate, page, limit, sort, order } = ctx.request.qs()
        const category_id = ctx.request.param('id')

        try {

            if( category_id ) {

                if( paginate != null && paginate == '1' || paginate == 1 ) {
                    const categoryRoles = await CategoryRole
                        .query()
                        .preload('role', (rolesQuery) => {
                            rolesQuery
                                .if(
                                    sort != null,
                                    (query) => {
                                        query.orderBy(sort, order)
                                    }, 
                                    (query) => {
                                        query.orderBy('name', 'asc')
                                    }
                                )
                        })
                        .where('category_id', category_id)
                        .paginate(page, limit ? limit : Env.get('PAGINATION_LIMIT'))
                    
                    return this.success(ctx, categoryRoles)
                    
                } else {
                    const categoryRoles = await CategoryRole
                        .query()
                        .preload('role')
                        .if(
                            sort != null,
                            (query) => {
                                query.orderBy(sort, order)
                            }, 
                            (query) => {
                                query.orderBy('name', 'asc')
                            }
                        )
                        .where('category_id', category_id)
    
                    return this.success(ctx, categoryRoles)
                }
    
            } else {
    
                return this.error(ctx, 'Category ID is required')
                
            }

        } catch(error) {
            console.log(error)
            return this.error(ctx, error)
        }
        
    }

}
