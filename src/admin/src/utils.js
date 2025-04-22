export const cleanDateString = (dateString) =>
  dateString ? dateString.replace(" 00:00:00 GMT", "") : dateString;
