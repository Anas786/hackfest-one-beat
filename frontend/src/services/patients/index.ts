import { apiClient } from "constants/axiosUtils";
import { CreatePatientResponse, CreatePatientPayload, IPatient, ISingleResponse } from "types";

const VERSION = `/api/v1`;
const PATIENT_API = `${VERSION}/patients`;

interface IPatientParams {
  paginate?: number;
  limit?: number;
  page?: number;
  is_active?: boolean;
  gender?: string;
  nic?: string;
  mr_number?: string;
}

export interface IPostMedicalOrderData {
  patient_id: number;
  appointment_id: number;
  glucose: number;
  temperature?: number;
  bp_systolic: number;
  bp_diastolic: number;
  pulse: number;
  o2_level: number;
  other_allergies?: string;
  notes?: string;
}

export const fetchPatients = async (params: IPatientParams = {}) => {
  const response = await apiClient.get(`${PATIENT_API}`, { params });
  return response?.data?.data;
};

export const fetchPatientDetail = async (id: number) => {
  const response = await apiClient.get<ISingleResponse<IPatient>>(`${PATIENT_API}/${id}`);
  return response.data;
};

export const createPatient = async (data: CreatePatientPayload) => {
  const response = await apiClient.post<ISingleResponse<CreatePatientResponse>>(
    `${PATIENT_API}`,
    data
  );
  return response.data;
};

export const postMedicalOrder = async (data: IPostMedicalOrderData) => {
  const response = await apiClient.post(`${PATIENT_API}/${data.patient_id}/medical_records`);
  return response?.data;
};

export const postMedicationOrder = async (data: any) => {
  const response = await apiClient.post(
    `${PATIENT_API}/${data.patient_id}/medication_orders`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response?.data;
};

export const postDiagnosticOrder = async (data: any, patient_id: number) => {
  const response = await apiClient.post(`${PATIENT_API}/${patient_id}/diagnostic_orders`, data);
  return response?.data;
};

export const postSpecialtyConsults = async (data: any, patient_id: number) => {
  const response = await apiClient.post(`${PATIENT_API}/${patient_id}/specialty_consults`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response?.data;
};
