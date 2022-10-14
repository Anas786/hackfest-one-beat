import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import ApiResponse from 'App/Traits/ApiResponse'
import Specialty from 'App/Models/Specialty'

export default class SpecialtiesController extends ApiResponse {

    public async index(ctx: HttpContextContract) {  
        
        const { paginate, page, limit, sort, order } = ctx.request.qs()
        const id = ctx.request.param('id')

        try {

            if( id ) {

                const specialty = await Specialty
                .query()
                .where('id', id)
                .firstOrFail()
    
                this.success(ctx, specialty)
    
            } else {
    
                if( paginate != null && paginate == '1' || paginate == 1 ) {
                    const specialties = await Specialty
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
                    
                    this.success(ctx, specialties)
                    
                } else {
                    const specialties = await Specialty
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
    
                    this.success(ctx, specialties)
                }
            }

        } catch(error) {
            console.log(error)
            this.error(ctx, error)
        }
        
    }

}
