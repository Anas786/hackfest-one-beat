import axios from "axios";
import { IResponse } from "types";
import { IBedType, ITransportationType } from "pages/TransferForm/utils/types";

export const getBedTypes = async () => {
  const response = await axios.get<IResponse<Array<IBedType>>>(
    "http://api.getonebeat.com/api/v1/bed_types"
  );
  return response.data;
};

export const getTransportationTypes = async () => {
  const response = await axios.get<IResponse<Array<ITransportationType>>>(
    "http://api.getonebeat.com/api/v1/transportations"
  );
  return response.data;
};
