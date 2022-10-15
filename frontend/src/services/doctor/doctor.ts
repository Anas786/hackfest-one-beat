import { apiClient } from "constants/axiosUtils";

const VERSION = `/api/v1`;
const DOCTOR_API = `${VERSION}/doctors`;

interface IDoctorListParams {
  paginate?: number;
  limit?: number;
  page?: number;
  is_active?: number;
  facility_id?: string;
}

export const fetchDoctors = async (params: IDoctorListParams = {}) => {
  const response = await apiClient.get(`${DOCTOR_API}`, { params });
  return response?.data?.data;
};
