import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import ApiResponse from 'App/Traits/ApiResponse'
import Transportation from 'App/Models/Transportation'

export default class TransportationController extends ApiResponse {

    public async index(ctx: HttpContextContract) {  
        
        const { paginate, page, limit, sort, order } = ctx.request.qs()
        const id = ctx.request.param('id')

        try {

            if( id ) {

                const transportation = await Transportation
                .query()
                .where('id', id)
                .firstOrFail()
    
                return this.success(ctx, transportation)
    
            } else {
    
                if( paginate != null && paginate == '1' || paginate == 1 ) {
                    const transportations = await Transportation
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
                    
                    return this.success(ctx, transportations)
                    
                } else {
                    const transportations = await Transportation
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
    
                    return this.success(ctx, transportations)
                }
            }

        } catch(error) {
            console.log(error)
            return this.error(ctx, error)
        }
        
    }

}

