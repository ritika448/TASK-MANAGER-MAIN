export function getDueStatusLabel(date?: string) {
  if (!date) {
    return "No due date";
  }

  return `Due ${date}`;
}
