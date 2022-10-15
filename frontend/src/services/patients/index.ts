import { apiClient } from "constants/axiosUtils";
import { IPatient, ISingleResponse } from "types";

const VERSION = `/api/v1`;
const PATIENT_API = `${VERSION}/patients`;

interface IPatientParams {
  paginate?: number;
  limit?: number;
  page?: number;
  is_active?: boolean;
  gender?: string;
  cnic?: string;
  mr_number?: string;
}

export const fetchPatients = async (params: IPatientParams = {}) => {
  const response = await apiClient.get(`${PATIENT_API}`, { params });
  return response?.data?.data;
};

export const fetchPatientDetail = async (id: number) => {
  const response = await apiClient.get<ISingleResponse<IPatient>>(
    `http://api.getonebeat.com/api/v1/patients/${id}`
  );
  return response.data;
};
