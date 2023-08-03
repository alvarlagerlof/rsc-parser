function random(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function getColorForFetch(fetchStartTime: number) {
  return `oklch(80% 0.15 ${random(fetchStartTime) * 360})`;
}
