import { readInput } from "../helpers";

const input = readInput().map((line) => line.split(" "));

let hr = 0;
let hc = 0;
let tr = 0;
let tc = 0;

const grid: Record<string, string> = {};
const visited: Record<string, number> = {
  "0,0": 1,
};

const getKey = (row: number, col: number) => `${row},${col}`;

const printMap = (map: Record<string, any>) => {
  console.log("\n=========\n");
  const indicies = Object.keys(map)
    .map((key) => key.split(","))
    .map(([row, col]) => [Number(row), Number(col)]);

  const minRow = Math.min(...indicies.map(([row]) => row));
  const maxRow = Math.max(...indicies.map(([row]) => row));
  const minCol = Math.min(...indicies.map(([, col]) => col));
  const maxCol = Math.max(...indicies.map(([, col]) => col));

  for (let row = minRow; row <= maxRow; row++) {
    let line = "";
    for (let col = minCol; col <= maxCol; col++) {
      const key = getKey(row, col);

      if (key === "0,0" && map[key] === ".") line += "s";
      else {
        line += map[key] || ".";
      }
    }
    console.log(line);
  }
};

input.forEach((line) => {
  let dir = line[0];
  const count = Number(line[1]);

  for (let i = 0; i < count; i++) {
    grid[getKey(hr, hc)] = ".";

    if (dir === "R") hc++;
    else if (dir === "U") hr--;
    else if (dir === "L") hc--;
    else if (dir === "D") hr++;

    grid[getKey(hr, hc)] = "H";
    grid[getKey(tr, tc)] = ".";

    let wDiff = hc - tc;
    let hDiff = hr - tr;

    if (Math.abs(wDiff) > 1 || Math.abs(hDiff) > 1) {
      if (dir === "R") {
        tc++;
        tr += hDiff;
      } else if (dir === "U") {
        tr--;
        tc += wDiff;
      } else if (dir === "L") {
        tc--;
        tr += hDiff;
      } else if (dir === "D") {
        tr++;
        tc += wDiff;
      }
    }

    visited[getKey(tr, tc)] = 1;
    if (grid[getKey(tr, tc)] !== "H") grid[getKey(tr, tc)] = "T";
    // printMap(grid);
    // printMap(visited);
  }
});

let overlapCount = Object.values(visited).reduce((acc, val) => acc + val, 0);
console.log(overlapCount);
