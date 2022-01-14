// type alias for empty strings

export type EmptyString = "";
export type NonNegativeNumber = number;

// use this functions for more readability

function equal(a: unknown, b: unknown): boolean {
  return a === b;
}

function empty(x: ArrayLike<unknown>) {
  return x.length === 0;
}

export function compareDistance(a: EmptyString | string, b: EmptyString | string): NonNegativeNumber {
  if (empty(a) && b) {
    return b.length;
  }

  if (empty(b) && a) {
    return a.length;
  }

  if (equal(a, b)) {
    return 0;
  }

  const [first1, rest1] = [a[0], a.slice(1)];
  const [first2, rest2] = [b[0], b.slice(1)];

  if (first1 === first2) {
    const result = compareDistance(rest1, rest2);
    return result;
  } else {
    const result = [compareDistance(a, rest2), compareDistance(rest1, b), compareDistance(rest1, rest2)];
    return 1 + Math.min(...result);
  }
}
