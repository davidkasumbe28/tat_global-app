export function formatNumber(num : number | string, length : number) {
  return num.toString().padStart(length, '0');
}
