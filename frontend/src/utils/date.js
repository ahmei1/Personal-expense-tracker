export function todayString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function thisMonthString() {
  return todayString().slice(0, 7);
}

export function dateOnly(value) {
  return String(value || "").slice(0, 10);
}

export function showDate(value) {
  const [year, month, day] = dateOnly(value).split("-");

  if (!year || !month || !day) {
    return "";
  }

  return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString();
}
