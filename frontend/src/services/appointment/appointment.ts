import { apiClient } from "constants/axiosUtils";
import { IAppointment } from "types";

const VERSION = `/api/v1`;
const PATIENT_API = `${VERSION}/appointments`;

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
  const response = await apiClient.get(`${PATIENT_API}`, { params });
  return response?.data?.data;
};

export const createAppointment = async (data: IAppointment) => {
  const response = await apiClient.post(`${PATIENT_API}`, data);
  console.log(response);
  return response?.data?.data;
};
