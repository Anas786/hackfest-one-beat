import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import ApiResponse from 'App/Traits/ApiResponse'
// import CreateFacilityValidator from 'App/Validators/Facility/CreateFacilityValidator'
import PatientMedicationOrder from 'App/Models/PatientMedicationOrder'
import User from 'App/Models/User'

export default class PatientMedicationOrdersController extends ApiResponse {

    public async index(ctx: HttpContextContract) {  
        
        const { paginate, page, limit, sort, order, appointment_id } = ctx.request.qs()
        const patient_id = ctx.request.param('id')

        try {

            if( patient_id ) {
                
                if( paginate != null && paginate == '1' || paginate == 1 ) {
                    const medicationOrders = await PatientMedicationOrder
                        .query()
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
                    
                    return this.success(ctx, medicationOrders)
                    
                } else {
                    const medicationOrders = await PatientMedicationOrder
                        .query()
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
    
                    return this.success(ctx, medicationOrders)
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
            diet_id,
            iv_fluid_id,
            meds,
            notes
        } = ctx.request.all()
        const patient_id = ctx.request.param('id')

        try {

            const user = await User.findOrFail(patient_id)

            await user.related('medication_orders').create({
                appointmentId: appointment_id,
                dietId: diet_id,
                ivFluidId: iv_fluid_id,
                meds: meds,
                notes: notes
            })

            return this.success(ctx, null, 'Medication Order has been created')

        } catch (error) {
            console.log(error.messages)
            return this.error(ctx, error.messages)
        }
    }

}

