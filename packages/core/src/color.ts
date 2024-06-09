function random(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function getColorForFetch(requestId: string) {
  let number = 0;

  for (let i = 0; i < requestId.length; i++) {
    number += requestId.charCodeAt(i);
  }

  return `oklch(80% 0.15 ${random(number) * 360})`;
}
