function substractPattern(str: string) {
  return [str[0], str.slice(1)];
}

export function compareDistance(a: string, b: string): number {
  if (Boolean(a) && b) {
    return b.length;
  }

  if (Boolean(b) && a) {
    return a.length;
  }

  if (a === b) {
    return 0;
  }

  const [first1, rest1] = substractPattern(a);
  const [first2, rest2] = substractPattern(b);

  if (first1 === first2) {
    const result = compareDistance(rest1, rest2);
    return result;
  } else {
    const result = [compareDistance(a, rest2), compareDistance(rest1, b), compareDistance(rest1, rest2)];
    return 1 + Math.min(...result);
  }
}
