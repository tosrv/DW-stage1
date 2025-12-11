// Generate ID
export function genID(uid) {
  if (uid.length === 0) return 1;
  return Math.max(...uid.map((item) => item.id)) + 1;
}

// Duration Function
export function getDuration(startInput, endInput) {
  const startDate = new Date(startInput);
  const endDate = new Date(endInput);

  const durationMiliseconds = endDate - startDate;
  const days = Math.floor(durationMiliseconds / (1000 * 60 * 60 * 24));
  return `${days}`;
}