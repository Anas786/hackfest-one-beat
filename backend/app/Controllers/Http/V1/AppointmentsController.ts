import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import { string } from '@ioc:Adonis/Core/Helpers'
import ApiResponse from 'App/Traits/ApiResponse'
import CreateAppointmentValidator from 'App/Validators/Appointment/CreateAppointmentValidator'
import Appointment from 'App/Models/Appointment'

export default class AppointmentsController extends ApiResponse {

    public async index(ctx: HttpContextContract) {  
        
        const { paginate, page, limit, sort, order, code, status, facility_id, patient_id, doctor_id, mr_number } = ctx.request.qs()
        const id = ctx.request.param('id')

        try {

            if( id ) {

                const appointment = await Appointment
                    .query()
                    .preload('patient')
                    .preload('doctor')
                    .preload('facility')
                    .where('id', id)
                    .firstOrFail()
    
                return this.success(ctx, appointment)
    
            } else {
    
                if( paginate != null && paginate == '1' || paginate == 1 ) {
                    const appointments = await Appointment
                    .query()
                    .preload('patient')
                    .preload('doctor')
                    .preload('facility')
                    .if(
                        status != null, 
                        (query) => {
                            query.where('status', status)
                        },
                        () => {
        
                        }
                    )
                    .if(
                        mr_number != null, 
                        (query) => {
                            query.whereHas('patient', (patientsQuery) => {
                                patientsQuery.where('mr_number', mr_number)
                            })
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
                        doctor_id != null, 
                        (query) => {
                            query.where('doctor_id', doctor_id)
                        },
                        () => {
        
                        }
                    )
                    .if(
                        patient_id != null, 
                        (query) => {
                            query.where('user_id', patient_id)
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
                    
                    return this.success(ctx, appointments)
                    
                } else {
                    const appointments = await Appointment
                    .query()
                    .preload('patient')
                    .preload('doctor')
                    .preload('facility')
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
                        doctor_id != null, 
                        (query) => {
                            query.where('doctor_id', doctor_id)
                        },
                        () => {
        
                        }
                    )
                    .if(
                        patient_id != null, 
                        (query) => {
                            query.where('user_id', patient_id)
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
                    .if(
                        sort != null,
                        (query) => {
                            query.orderBy(sort, order)
                        }, 
                        (query) => {
                            query.orderBy('created_at', 'desc')
                        }
                    )
    
                    return this.success(ctx, appointments)
                }
            }

        } catch(error) {
            console.log(error)
            return this.error(ctx, error)
        }
    }

    public async checkAvailability(ctx: HttpContextContract) {
        const { 
            appointment_date,
            appointment_time,
            facility_id,
            doctor_id
        } = ctx.request.all()

        try {

            const appointment = await Appointment
                .query()
                .where('appointment_date', appointment_date)
                .where('appointment_time', appointment_time)
                .where('facility_id', facility_id)
                .where('doctor_id', doctor_id)

            if( appointment.length > 0 ) {
                return this.error(ctx, 'Appointment slot is not available')
            }

            return this.success(ctx, null, 'Booking slot available')

        } catch (error) {
            console.log(error)
            return this.error(ctx, error.messages)
        }
    }

    public async create(ctx: HttpContextContract) {
        const { 
            patient_id,
            facility_id,
            doctor_id,
            appointment_date,
            appointment_time,
            status
        } = ctx.request.all()

        try {
            // Validate parameters
            await ctx.request.validate(CreateAppointmentValidator)

            const appointmentCheck = await Appointment
                .query()
                .where('appointment_date', appointment_date)
                .where('appointment_time', appointment_time)
                .where('facility_id', facility_id)
                .where('doctor_id', doctor_id)

            if( appointmentCheck.length > 0 ) {
                return this.error(ctx, 'Appointment slot is not available')
            }

            const appointmentCode = string.generateRandom(6)

            const appointment = new Appointment()

            appointment.code = appointmentCode
            appointment.userId = patient_id
            appointment.facilityId = facility_id
            appointment.doctorId = doctor_id
            appointment.appointmentDate = appointment_date
            appointment.appointmentTime = appointment_time
            appointment.status = (status != null) ? status : Appointment.STATUS.CONFIRMED

            await appointment.save()

            return this.success(ctx, appointment.toJSON(), 'Appointment has been created')

        } catch (error) {
            console.log(error)
            return this.error(ctx, error.messages)
        }
    }

}
