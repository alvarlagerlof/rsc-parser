export function stringToKiloBytes(data: string) {
  return ((encodeURI(data).split(/%..|./).length - 1) / 1024).toFixed(2);
}
