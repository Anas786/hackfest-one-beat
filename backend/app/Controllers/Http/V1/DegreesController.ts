import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import ApiResponse from 'App/Traits/ApiResponse'
import Degree from 'App/Models/Degree'

export default class DegreesController extends ApiResponse {

    public async index(ctx: HttpContextContract) {  
        
        const { paginate, page, limit, sort, order } = ctx.request.qs()
        const id = ctx.request.param('id')

        try {

            if( id ) {

                const degree = await Degree
                .query()
                .where('id', id)
                .firstOrFail()
    
                return this.success(ctx, degree)
    
            } else {
    
                if( paginate != null && paginate == '1' || paginate == 1 ) {
                    const degrees = await Degree
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
                    
                    return this.success(ctx, degrees)
                    
                } else {
                    const degrees = await Degree
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
    
                    return this.success(ctx, degrees)
                }
            }

        } catch(error) {
            console.log(error)
            return this.error(ctx, error)
        }
        
    }

}
