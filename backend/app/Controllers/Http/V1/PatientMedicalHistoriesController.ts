import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import ApiResponse from 'App/Traits/ApiResponse'
// import CreateFacilityValidator from 'App/Validators/Facility/CreateFacilityValidator'
import PatientMedicalHistory from 'App/Models/PatientMedicalHistory'
import User from 'App/Models/User'

export default class PatientMedicalHistoriesController extends ApiResponse {

    public async index(ctx: HttpContextContract) {  
        
        const { paginate, page, limit, sort, order, appointment_id } = ctx.request.qs()
        const patient_id = ctx.request.param('id')

        try {

            if( patient_id ) {
                
                if( paginate != null && paginate == '1' || paginate == 1 ) {
                    const medicalHistories = await PatientMedicalHistory
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
                    
                    return this.success(ctx, medicalHistories)
                    
                } else {
                    const medicalHistories = await PatientMedicalHistory
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
    
                    return this.success(ctx, medicalHistories)
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
            temperature,
            glucose,
            bp_systolic,
            bp_diastolic,
            pulse,
            o2_level,
            other_allergies,
            notes
        } = ctx.request.all()
        const patient_id = ctx.request.param('id')

        try {

            const user = await User.findOrFail(patient_id)

            await user.related('medical_histories').create({
                appointmentId: appointment_id,
                temperature: temperature,
                glucose: glucose,
                bpSystolic: bp_systolic,
                bpDiastolic: bp_diastolic,
                pulse: pulse,
                o2Level: o2_level,
                otherAllergies: other_allergies,
                notes: notes
            })

            return this.success(ctx, null, 'Medical Record has been created')

        } catch (error) {
            console.log(error.messages)
            return this.error(ctx, error.messages)
        }
    }

}
