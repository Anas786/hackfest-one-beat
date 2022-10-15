import { apiClient } from "constants/axiosUtils";
import { IAppointment } from "types";

const VERSION = `/api/v1`;
const APPOINTMENT_API = `${VERSION}/appointments`;

interface IAppointmentListParams {
  paginate?: number;
  limit?: number;
  page?: number;
  status?: string;
  code?: string;
  facility_id?: string;
  patient_id?: string;
  doctor_id?: string;
}

export const fetchAppointments = async (params: IAppointmentListParams = {}) => {
  const response = await apiClient.get(`${APPOINTMENT_API}`, { params });
  return response?.data?.data;
};

export const createAppointment = async (data: IAppointment) => {
  const response = await apiClient.post(`${APPOINTMENT_API}`, data);
  return response?.data?.data;
};
