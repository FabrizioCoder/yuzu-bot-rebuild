type EmptyString = "";
type EmptyArray = [];

function empty(x: unknown[]): x is EmptyArray;
function empty(x: string): x is EmptyString;
function empty(x: ArrayLike<unknown>) {
  return x.length === 0;
}

function tail<T>(list: T[]): T[];
function tail(list: string): string;
function tail(list: unknown[]): unknown[];
function tail(list: unknown[] | string) {
  return list.slice(1);
}

function head<T>(list: T[]): T;
function head(list: string): string;
function head(list: unknown[]): unknown;
function head(list: unknown[] | string) {
  return list.at(0);
}

function substractPattern(str: string) {
  return [head(str), tail(str)];
}

type NonNegativeNumber = number;

export function compareDistance(a: string, b: string): NonNegativeNumber {
  if (empty(a) && b) {
    return b.length;
  }

  if (empty(b) && a) {
    return a.length;
  }

  const [first1, rest1] = substractPattern(a);
  const [first2, rest2] = substractPattern(b);

  if (a === b) {
    return 0;
  }

  if (first1 === first2) {
    const result = compareDistance(rest1, rest2);
    return result;
  } else {
    const result = [compareDistance(a, rest2), compareDistance(rest1, b), compareDistance(rest1, rest2)];
    return 1 + Math.min(...result);
  }
}
