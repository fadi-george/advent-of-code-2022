/*
--- Part Two ---
It seems like there is still quite a bit of duplicate work planned. Instead, the Elves would like to know the number of pairs that overlap at all.

In the above example, the first two pairs (2-4,6-8 and 2-3,4-5) don't overlap, while the remaining four pairs (5-7,7-9, 2-8,3-7, 6-6,4-6, and 2-6,4-8) do overlap:

5-7,7-9 overlaps in a single section, 7.
2-8,3-7 overlaps all of the sections 3 through 7.
6-6,4-6 overlaps in a single section, 6.
2-6,4-8 overlaps in sections 4, 5, and 6.
So, in this example, the number of overlapping assignment pairs is 4.

In how many assignment pairs do the ranges overlap?
*/
console.time("Part 2");
import { readInput } from "../helpers";

const input = readInput();

const total = input.reduce((total, line, index) => {
  const [range1, range2] = line.split(",");
  const [start1, end1] = range1.split("-").map(Number);
  const [start2, end2] = range2.split("-").map(Number);

  const overlaps =
    (start1 >= start2 && start1 <= end2) ||
    (start2 >= start1 && start2 <= end1);

  return overlaps ? total + 1 : total;
}, 0);

// console.log(total);
console.timeEnd("Part 2");
