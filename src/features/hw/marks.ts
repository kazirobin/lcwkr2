// Marks can be fractional: a part worth 10 marks split over 7 questions is
// 1.43 each. Floating point addition then leaves tails like 9.999999999, so
// every displayed or stored mark total goes through round2 / sumMarks.

/** Round to 2 decimals - enough for 0-10 marks, kills float tails. */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Add up the marks of a list of questions and drop the float tail. */
export function sumMarks(items: { marks: number }[]): number {
  return round2(items.reduce((n, q) => n + q.marks, 0));
}
