import { readInput } from "../helpers";

const useSample = false;

const r1 = [["#", "#", "#", "#"]];
const r2 = [
  [".", "#", "."],
  ["#", "#", "#"],
  [".", "#", "."],
];
const r3 = [
  [".", ".", "#"],
  [".", ".", "#"],
  ["#", "#", "#"],
];
const r4 = [["#"], ["#"], ["#"], ["#"]];
const r5 = [
  ["#", "#"],
  ["#", "#"],
];
const rocks = [r1, r2, r3, r4, r5];
let grid: string[][] = [];

// types
type Position = { row: number; col: number };

// globals
const gust = readInput(useSample, "");
const position = { row: 0, col: 0 };
let highestRock = 0;
let gInd = 0;

// helpers
const printGrid = () => {
  grid.forEach((row) => {
    console.log(row.join(""));
  });

  console.log("\n");
};

const drawRock = (rock: string[][], ch: string = "@") => {
  const rockLength = rock.length - 1;
  const { row, col } = position;

  rock.forEach((r, i) => {
    r.forEach((c, j) => {
      grid[row + i - rockLength][col + j] = c === "." ? "." : ch;
    });
  });
};

const cleanUp = () => {
  let blockedCount = 0;
  for (let i = grid.length - 1; i < grid.length; i++) {
    const row = grid[i];
    for (let j = 0; j < row.length; j++) {
      if (row[j] === "@") {
        blockedCount++;
        row[j] = "#";
      }
    }
  }
};

const WIDTH = 7;
const shiftRock = (rock: string[][]) => {
  const currGust = gust[gInd++];
  if (gInd >= gust.length) gInd = 0;

  // console.log("Moving: ", currGust);
  const { col } = position;
  const w = rock[0].length;
  const h = rock.length;

  if (currGust === ">") {
    if (col + rock[0].length <= WIDTH - 1) {
      for (let r = 0; r < rock.length; r++) {
        const ch = grid[position.row - r][col + w];
        const rCh = rock[h - r - 1][col + w];
        if (ch !== "." && rCh !== ".") {
          return;
        }
      }

      drawRock(rock, ".");
      position.col++;
      drawRock(rock);
      return;
    }
  } else if (currGust === "<") {
    if (col >= 1) {
      for (let r = 0; r < rock.length; r++) {
        const ch = grid[position.row - r][col - 1];
        const rCh = rock[h - r - 1][col - 1];
        if (ch !== "." && rCh !== ".") {
          return;
        }
      }

      drawRock(rock, ".");
      position.col--;
      drawRock(rock);
      return;
    }
  }
};

const fallDown = (rock: string[][]) => {
  // console.log("Falling down");
  const rockLen = rock[0].length;

  if (position.row + 1 >= grid.length) return false;

  const gridRow = grid[position.row + 1];
  for (let j = 0; j < rockLen; j++) {
    const ch = gridRow[j + position.col];
    const rockCh = rock[rock.length - 1][j];

    if (ch !== "." && rockCh !== ".") {
      return false;
    }
  }

  drawRock(rock, ".");
  position.row++;
  drawRock(rock);

  highestRock = position.row - (rock.length - 1);

  return true;
};

let currHeight = 0;
for (let i = 0; i < 20; i++) {
  let moving = true;
  let currRock = rocks[i % rocks.length];

  const diff = highestRock - 3 - currRock.length;
  if (diff) {
    const len = Math.abs(diff);
    grid = [
      ...Array(len)
        .fill("")
        .map(() => Array(7).fill(".")),
      ...grid,
    ];
    highestRock += len - 1;
    currHeight += len;
  }

  position.row = highestRock - 3;
  position.col = 2;
  drawRock(currRock);
  // printGrid();

  while (moving) {
    shiftRock(currRock);
    // printGrid();
    const valid = fallDown(currRock);
    // printGrid();

    if (!valid) {
      drawRock(currRock, "#");
      // printGrid();
      moving = false;
    }
  }

  cleanUp();
}

console.log("Grid Height: ", currHeight);
