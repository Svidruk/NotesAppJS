export function extractDates(text) {
  const datePattern = /\d{1,2}\/\d{1,2}\/\d{4}/g;
  return text.match(datePattern) || [];
}
