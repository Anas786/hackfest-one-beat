import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import ApiResponse from 'App/Traits/ApiResponse'
// import CreateFacilityValidator from 'App/Validators/Facility/CreateFacilityValidator'
import PatientSpecialtyConsult from 'App/Models/PatientSpecialtyConsult'

export default class PatientSpecialtyConsultsController extends ApiResponse {

    public async index(ctx: HttpContextContract) {  
        
        const { paginate, page, limit, sort, order, appointment_id } = ctx.request.qs()
        const patient_id = ctx.request.param('id')

        try {

            if( patient_id ) {
                
                if( paginate != null && paginate == '1' || paginate == 1 ) {
                    const diagnosticOrders = await PatientSpecialtyConsult
                        .query()
                        .preload('consults', (consultsQuery) => {
                            consultsQuery
                                .preload('consult')
                        })
                        .if(
                            patient_id != null,
                            (query) => {
                                query.where('patient_id', patient_id)
                            },
                            () => {
            
                            }
                        )
                        .if(
                            appointment_id != null,
                            (query) => {
                                query.where('appointment_id', appointment_id)
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
                    
                    return this.success(ctx, diagnosticOrders)
                    
                } else {
                    const diagnosticOrders = await PatientSpecialtyConsult
                        .query()
                        .preload('consults', (consultsQuery) => {
                            consultsQuery
                                .preload('consult')
                        })
                        .if(
                            patient_id != null,
                            (query) => {
                                query.where('patient_id', patient_id)
                            },
                            () => {
            
                            }
                        )
                        .if(
                            appointment_id != null,
                            (query) => {
                                query.where('appointment_id', appointment_id)
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
    
                    return this.success(ctx, diagnosticOrders)
                }

            }

        } catch(error) {
            console.log(error)
            return this.error(ctx, error)
        }
        
    }

    public async create(ctx: HttpContextContract) {
        const { 
            appointment_id,
            consults,
            notes
        } = ctx.request.all()
        const patient_id = ctx.request.param('id')

        try {

            const specialtyConsult = new PatientSpecialtyConsult()

            specialtyConsult.patientId = patient_id
            specialtyConsult.appointmentId = appointment_id
            specialtyConsult.notes = notes

            await specialtyConsult.save()

            // Add consults
            await specialtyConsult
                .related('consults')
                .query()
                .delete()

            const consultIds = consults.split(',').map((v) => {
                return { consultId: v }
            })

            await specialtyConsult
                .related('consults')
                .createMany(consultIds)

            return this.success(ctx, null, 'Specialty Consult has been created')

        } catch (error) {
            console.log(error)
            return this.error(ctx, error.messages)
        }
    }

}
