import { readInput } from "../helpers";

const input = readInput(true).map((line) => line.split("").map(Number));

let visibleCount = input.length * 2 + (input[0].length - 2) * 2;
let cols = input[0].length;

for (let i = 1; i < input.length - 1; i++) {
  for (let j = 1; j < cols - 1; j++) {
    let curr = input[i][j];

    const slices = [
      input.slice(0, i).map((row) => row[j]), // top
      input.slice(i + 1).map((row) => row[j]), // bottom
      input[i].slice(0, j), // left
      input[i].slice(j + 1), // right
    ];

    slices.some((slice) => {
      const isVis = slice.filter((num) => num < curr).length === slice.length;
      if (isVis) {
        visibleCount++;
        return true;
      }
    });
  }
}

console.log(visibleCount);
