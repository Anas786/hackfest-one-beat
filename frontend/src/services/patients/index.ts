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
