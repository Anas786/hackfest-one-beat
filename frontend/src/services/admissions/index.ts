// http://api.getonebeat.com/api/v1/admissions?paginate=1&limit=10&page=1&status=&code=&facility_id=1&patient_id=&doctor_id=&referral_facility_id=2&mr_number=401-93-0

import { apiClient } from "constants/axiosUtils";
import { IAdmissions, IResponse } from "types";

export const fetchAdmissions = async () => {
  const response = await apiClient.get<IResponse<Array<IAdmissions>>>(
    "http://api.getonebeat.com/api/v1/admissions?paginate=1&limit=100"
  );
  return response.data;
};
