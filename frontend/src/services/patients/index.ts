import { apiClient } from "constants/axiosUtils";
import {
  CreatePatientResponse,
  CreatePatientPayload,
  IPatient,
  ISingleResponse,
  IResponse,
  IMedicalRecord,
  IDiagnosticOrder,
  IMedicationOrder,
  ISpecialConsult,
} from "types";

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

export const fetchMedicalRecords = async (id: number) => {
  const response = await apiClient.get<IResponse<Array<IMedicalRecord>>>(
    `${PATIENT_API}/${id}/medical_records?paginate=1&limit=10&page=1`
  );
  return response.data;
};

export const fetchMedicationOrders = async (id: number) => {
  const response = await apiClient.get<IResponse<Array<IMedicationOrder>>>(
    `${PATIENT_API}/${id}/medication_orders?paginate=1&limit=10&page=1`
  );
  return response.data;
};

export const fetchDiagnosticOrders = async (id: number) => {
  const response = await apiClient.get<IResponse<Array<IDiagnosticOrder>>>(
    `${PATIENT_API}/${id}/diagnostic_orders?paginate=1&limit=10&page=1`
  );
  return response.data;
};

export const fetchSpecialityConsults = async (id: number) => {
  const response = await apiClient.get<IResponse<Array<ISpecialConsult>>>(
    `${PATIENT_API}/${id}/specialty_consults?paginate=1&limit=10&page=1`
  );
  return response.data;
};
