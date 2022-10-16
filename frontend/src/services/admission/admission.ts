import { apiClient } from "constants/axiosUtils";

const VERSION = `/api/v1`;
const ADMISSION_API = `${VERSION}/admissions`;

export const createTransfer = async (data: any) => {
  const response = await apiClient.post(`${ADMISSION_API}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response?.data?.data;
};
