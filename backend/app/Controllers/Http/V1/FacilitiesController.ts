import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import ApiResponse from 'App/Traits/ApiResponse'
import Facility from 'App/Models/Facility'
import CreateFacilityValidator from 'App/Validators/Facility/CreateFacilityValidator'

export default class FacilitiesController extends ApiResponse {

    public async index(ctx: HttpContextContract) {  
        
        const { paginate, page, limit, sort, order } = ctx.request.qs()
        const id = ctx.request.param('id')

        try {

            if( id ) {

                const facility = await Facility
                .query()
                .where('id', id)
                .firstOrFail()
    
                return this.success(ctx, facility)
    
            } else {
    
                if( paginate != null && paginate == '1' || paginate == 1 ) {
                    const facilities = await Facility
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
                    
                    return this.success(ctx, facilities)
                    
                } else {
                    const facilities = await Facility
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
    
                    return this.success(ctx, facilities)
                }
            }

        } catch(error) {
            console.log(error)
            return this.error(ctx, error)
        }
        
    }

    public async create(ctx: HttpContextContract) {
        const { 
            name,
            address,
            address2,
            city,
            state,
            country_id,
            zip,
            latitude,
            longitude,
            facility_type_id,
            phone,
            email,
            representative_name,
            representative_email,
            representative_phone,
            is_active
        } = ctx.request.all()

        try {
            // Validate parameters
            await ctx.request.validate(CreateFacilityValidator)

            const facility = new Facility()

            facility.name = name
            facility.address = address
            facility.address2 = address2
            facility.city = city
            facility.state = state
            facility.zip = zip
            facility.countryId = country_id
            facility.latitude = latitude
            facility.longitude = longitude
            facility.facilityTypeId = facility_type_id
            facility.phone = phone
            facility.email = email
            facility.representativeName = representative_name
            facility.representativeEmail = representative_email
            facility.representativePhone = representative_phone
            facility.isActive = is_active ? is_active : false

            await facility.save()

            return this.success(ctx, facility.toJSON(), 'Facility has been created')

        } catch (error) {
            console.log(error.messages)
            return this.error(ctx, error.messages)
        }
    }

}
