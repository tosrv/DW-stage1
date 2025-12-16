// DISPLAY DATE FOR EDIT
export const fDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// DISPLAY DATE FOR DETAIL
export const disDate = (val) => {
  const date = new Date(val);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// DURATION FUNCTION
export const dur = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  const diff = e - s;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};