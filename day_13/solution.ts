import { isNumber, readInput } from "../helpers";

const input = readInput(true, "\n\n");

type Value = (number | Value)[];
const rightIndices: number[] = [];

const compare = (a: Value, b: Value): number => {
  for (let i = 0; i < a.length; i++) {
    let left = a[i];
    let right = b[i];

    if (right === undefined) return -1;

    if (isNumber(left)) {
      if (isNumber(right)) {
        if (left < right) return 1;
        if (left > right) return -1;
        continue;
      } else {
        left = [left];
      }
    } else if (isNumber(right)) {
      right = [right];
    }

    const valid = compare(left, right);
    if (valid !== 0) return valid;
  }

  if (a.length > b.length) return -1;
  if (a.length < b.length) return 1;
  return 0;
};

const packets: Value[] = [[[2]], [[6]]];
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
const sum = rightIndices.reduce((acc, curr) => acc + curr, 0);
console.log("Sum of ordered indices: ", sum);

// part 2
packets.sort((p1, p2) => compare(p2, p1));
const key1 = packets.findIndex((p) => JSON.stringify(p) === "[[6]]") + 1;
const key2 = packets.findIndex((p) => JSON.stringify(p) === "[[2]]") + 1;
console.log("Decoder key: ", key1 * key2);
