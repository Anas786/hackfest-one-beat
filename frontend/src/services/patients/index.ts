import axios from "axios";
import { IPatient } from "types";

const VERSION = `${process.env.REACT_APP_BE}/api/v1`;
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
  const response = await axios.get(`${PATIENT_API}`, { params });
  return response?.data?.data;
};
