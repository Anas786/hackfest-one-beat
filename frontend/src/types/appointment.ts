import { IFacility } from "pages/TransferForm/utils/types";
import { IDoctor, IPatient } from "./user";

export interface IAppointment {
  id: number;
  code: string;
  user_id: number;
  facility_id: number;
  appointment_date: string;
  appointment_time: string;
  doctor_id: number;
  status: number;
  created_at: string;
  updated_at: string;
  patient: IPatient;
  doctor: IDoctor;
  facility: IFacility;
}
export interface ICreateAppointment {
  patient_id: number;
  doctor_id: number;
  facility_id: number;
  appointment_date: string;
  appointment_time: string;
  status: 1 | 2 | 3 | 4 | 5;
}
