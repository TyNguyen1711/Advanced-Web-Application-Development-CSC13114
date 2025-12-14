function getDateTimeString(dateStr) {
  const date = new Date(dateStr);

  const pad = (n) => String(n).padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());

  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
}
export default getDateTimeString;
