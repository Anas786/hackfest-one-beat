import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import ApiResponse from 'App/Traits/ApiResponse'
import Category from 'App/Models/Category'

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
                    
                    this.success(ctx, categories)
                    
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
    
                    this.success(ctx, categories)
                }
            }

        } catch(error) {
            console.log(error)
            this.error(ctx, error)
        }
        
    }

}
