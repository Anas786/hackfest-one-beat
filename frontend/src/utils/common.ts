export const getDateString = (isoFormatDate?: string | Date) => {
  if (!isoFormatDate) return "---";
  const date = new Date(isoFormatDate);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getFullYear();
  return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
};
