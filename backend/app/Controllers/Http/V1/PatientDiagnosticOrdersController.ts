import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import ApiResponse from 'App/Traits/ApiResponse'
// import CreateFacilityValidator from 'App/Validators/Facility/CreateFacilityValidator'
import PatientDiagnosticOrder from 'App/Models/PatientDiagnosticOrder'

export default class PatientDiagnosticOrdersController extends ApiResponse {

    public async index(ctx: HttpContextContract) {  
        
        const { paginate, page, limit, sort, order, appointment_id } = ctx.request.qs()
        const patient_id = ctx.request.param('id')

        try {

            if( patient_id ) {
                
                if( paginate != null && paginate == '1' || paginate == 1 ) {
                    const diagnosticOrders = await PatientDiagnosticOrder
                        .query()
                        .preload('blood_tests', (bloodTestsQuery) => {
                            bloodTestsQuery
                                .preload('blood_test')
                        })
                        .preload('urine_tests', (urineTestsQuery) => {
                            urineTestsQuery
                                .preload('urine_test')
                        })
                        .preload('imaging_tests', (imagingTestsQuery) => {
                            imagingTestsQuery
                                .preload('imaging_test')
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
                    const diagnosticOrders = await PatientDiagnosticOrder
                        .query()
                        .preload('blood_tests', (bloodTestsQuery) => {
                            bloodTestsQuery
                                .preload('blood_test')
                        })
                        .preload('urine_tests', (urineTestsQuery) => {
                            urineTestsQuery
                                .preload('urine_test')
                        })
                        .preload('imaging_tests', (imagingTestsQuery) => {
                            imagingTestsQuery
                                .preload('imaging_test')
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
            blood_tests,
            urine_tests,
            imaging_tests,
            notes
        } = ctx.request.all()
        const patient_id = ctx.request.param('id')

        try {

            const diagnosticOrder = new PatientDiagnosticOrder()

            diagnosticOrder.patientId = patient_id
            diagnosticOrder.appointmentId = appointment_id
            diagnosticOrder.notes = notes

            await diagnosticOrder.save()

            // Add blood tests
            await diagnosticOrder
                .related('blood_tests')
                .query()
                .delete()

            const bloodTestIds = blood_tests.split(',').map((v) => {
                return { bloodTestId: v }
            })

            await diagnosticOrder
                .related('blood_tests')
                .createMany(bloodTestIds)

            // Add urine tests
            await diagnosticOrder
                .related('urine_tests')
                .query()
                .delete()

            const urineTestIds = urine_tests.split(',').map((v) => {
                return { urineTestId: v }
            })

            await diagnosticOrder
                .related('urine_tests')
                .createMany(urineTestIds)

            // Add imaging tests
            await diagnosticOrder
                .related('imaging_tests')
                .query()
                .delete()

            const imagingTestIds = imaging_tests.split(',').map((v) => {
                return { imagingTestId: v }
            })

            await diagnosticOrder
                .related('imaging_tests')
                .createMany(imagingTestIds)

            return this.success(ctx, null, 'Diagnostic Order has been created')

        } catch (error) {
            console.log(error)
            return this.error(ctx, error.messages)
        }
    }

}
