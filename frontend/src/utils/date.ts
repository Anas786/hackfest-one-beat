import { format, parseISO } from "date-fns";

export const formatDate = (date: string, dateFormat: string) => {
  return format(parseISO(date), dateFormat);
};

export const DATE_FORMAT = "MMMM d, yyyy";

export const SHORTENED_DATE_FORMAT = "MMM dd, yyyy";
