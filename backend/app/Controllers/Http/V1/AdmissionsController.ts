import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import { string } from '@ioc:Adonis/Core/Helpers'
import Admission from 'App/Models/Admission'
import ApiResponse from 'App/Traits/ApiResponse'
import CreateAdmissionValidator from 'App/Validators/Admission/CreateAdmissionValidator'

export default class AdmissionsController extends ApiResponse {

    public async index(ctx: HttpContextContract) {  
        
        const { paginate, page, limit, sort, order, status, code, facility_id, referral_facility_id } = ctx.request.qs()
        const id = ctx.request.param('id')

        try {

            if( id ) {

                const admission = await Admission
                    .query()
                    .preload('patient')
                    .preload('facility')
                    .preload('appointment')
                    .preload('transportation')
                    .preload('bed_type')
                    .where('id', id)
                    .firstOrFail()
    
                return this.success(ctx, admission)
    
            } else {
    
                if( paginate != null && paginate == '1' || paginate == 1 ) {
                    const admissions = await Admission
                        .query()
                        .preload('patient')
                        .preload('facility')
                        .preload('appointment')
                        .preload('transportation')
                        .preload('bed_type')
                        .if(
                            status != null, 
                            (query) => {
                                query.where('status', status)
                            },
                            () => {
            
                            }
                        )
                        .if(
                            code != null, 
                            (query) => {
                                query.where('code', code)
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
                            referral_facility_id != null, 
                            (query) => {
                                query.where('referral_facility_id', referral_facility_id)
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
                    
                    return this.success(ctx, admissions)
                    
                } else {
                    const admissions = await Admission
                        .query()
                        .preload('patient')
                        .preload('facility')
                        .preload('appointment')
                        .preload('transportation')
                        .preload('bed_type')
                        .if(
                            status != null, 
                            (query) => {
                                query.where('status', status)
                            },
                            () => {
            
                            }
                        )
                        .if(
                            code != null, 
                            (query) => {
                                query.where('code', code)
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
                            referral_facility_id != null, 
                            (query) => {
                                query.where('referral_facility_id', referral_facility_id)
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
    
                    return this.success(ctx, admissions)
                }
            }

        } catch(error) {
            console.log(error)
            return this.error(ctx, error)
        }
        
    }

    public async create(ctx: HttpContextContract) {
        const { 
            patient_id,
            appointment_id,
            facility_id,
            referral_facility_id,
            transportation_id,
            bed_type_id,
            eta,
            status,
            notes
        } = ctx.request.all()

        try {
            // Validate parameters
            await ctx.request.validate(CreateAdmissionValidator)

            const code = string.generateRandom(6)

            const admission = new Admission()

            admission.code = code
            admission.patientId = patient_id
            admission.appointmentId = appointment_id
            admission.facilityId = facility_id
            admission.referralFacilityId = referral_facility_id
            admission.transportationId = transportation_id
            admission.bedTypeId = bed_type_id
            admission.eta = eta
            admission.notes = notes
            admission.status = status != null ? status : Admission.STATUS.INITIATED

            await admission.save()

            return this.success(ctx, admission.toJSON(), 'Admission has been created')

        } catch (error) {
            console.log(error)
            return this.error(ctx, error.messages)
        }
    }

}
