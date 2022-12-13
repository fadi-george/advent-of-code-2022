import { readInput } from "../helpers";

const input = readInput(true, "\n\n");

type Value = number | Value[];
const rightIndices: number[] = [];

const compare = (left: Value[], right: Value[]): number => {
  for (let i = 0; i < left.length; i++) {
    let leftEl = left[i];
    let rightEl = right[i];

    if (rightEl === undefined) return -1;

    if (typeof leftEl === "number") {
      if (typeof rightEl === "number") {
        if (left[i] < right[i]) return 1;
        if (left[i] > right[i]) return -1;
        continue;
      } else {
        leftEl = [leftEl];
      }
    } else if (typeof rightEl === "number") {
      rightEl = [rightEl];
    }

    const valid = compare(leftEl, rightEl);
    if (valid !== 0) return valid;
  }

  if (left.length > right.length) return -1;
  if (left.length < right.length) return 1;
  return 0;
};

input.push(`[[2]]\n[[6]]`);

const packets: Value[] = [];
input.forEach((pairs, index) => {
  let [left, right] = pairs.split("\n").map((pair) => JSON.parse(pair));

  const diff = compare(left, right);
  if (diff === 1) {
    rightIndices.push(index + 1);
    packets.push(left, right);
  } else {
    packets.push(right, left);
  }
});

// part 1
const sum = rightIndices.slice(0, -1).reduce((acc, curr) => acc + curr, 0);
console.log("Sum of ordered indices: ", sum);

// part 2
packets.sort((p1, p2) => compare(p2, p1));
const key1 = packets.findIndex((p) => JSON.stringify(p) === "[[6]]") + 1;
const key2 = packets.findIndex((p) => JSON.stringify(p) === "[[2]]") + 1;
console.log("Decoder key: ", key1 * key2);
