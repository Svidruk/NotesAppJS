export function extractDates(text) {
  const datePattern = /\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4}/g;
  const dates = text.match(datePattern) || [];
  return dates.map((date) => date.replace(/[\/-]/g, "."))
}
