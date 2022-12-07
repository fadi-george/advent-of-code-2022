// console.time("Part 2");
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
// console.timeEnd("Part 2");
