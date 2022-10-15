import { format, parseISO } from "date-fns";
import moment from "moment";

export const formatDate = (date: string, dateFormat: string) => {
  if (!date) return "";
  return format(parseISO(date), dateFormat);
};

export const DATE_FORMAT = "MMMM d, yyyy";

export const SHORTENED_DATE_FORMAT = "MMM dd, yyyy";

export const getFormattedDate = (date: string) => {
  if (date) return moment(date).format("YYYY-MM-DD");
  return "";
};

export const getFormattedTime = (date: string) => {
  if (date) return moment(date).format("HH:mm:ss");
  return "";
};
