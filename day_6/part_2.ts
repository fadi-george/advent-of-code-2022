import { readInput } from "../helpers";

const sequence = readInput(true)[0];

let index = 0;
let len = 14;

for (let i = 0; i < sequence.length - len + 1; i++) {
  const subStr = sequence.slice(i, i + len);
  const isUnique = new Set(subStr).size === len;

  if (isUnique) {
    index = i + len - 1;
    break;
  }
}

console.log(index + 1);
