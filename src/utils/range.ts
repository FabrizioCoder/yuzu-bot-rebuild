export function range(start: number, stop = start, step = 1) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + (i * step),
  );
}

export function rangeChar(start: string, stop = start, step = 1) {
  return range(start.charCodeAt(0), stop.charCodeAt(0), step).map((x) =>
    String.fromCharCode(x)
  );
}
