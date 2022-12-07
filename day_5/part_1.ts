import fs from "fs";

const [stacksStr, movesStr] = fs
  .readFileSync("./input.txt", "utf8")
  .split("\n\n");
const stackRows = stacksStr.split("\n");

// keep track of the stacks
const stacks: Record<string, string[]> = {};

for (let i = stackRows.length - 2; i >= 0; i--) {
  const row = stackRows[i].split(/\s{4}|\s{1}/);
  row.forEach((crate, index) => {
    if (crate !== "") {
      if (!stacks[index + 1]) stacks[index + 1] = [];
      stacks[index + 1].push(crate[1]);
    }
  });
}

// determine stack positions after moves
movesStr.split("\n").forEach((move) => {
  const [count, from, to] = move.match(/(\d+)/g)!;
  const crates = stacks[from].splice(-count).reverse();
  stacks[to].push(...crates);
});
const res = Object.values(stacks).reduce(
  (res, stack) => res + stack[stack.length - 1],
  ""
);

console.log(res);
