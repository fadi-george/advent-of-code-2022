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

// globals
const WIDTH = 7;

const gust = readInput(useSample, "");

const position = { row: 0, col: 0 };

let gInd = 0;

// helpers
const printGrid = () => {
  grid.forEach((row) => {
    console.log(row.join(""));
  });

  console.log("\n");
};

const drawRock = (rock: string[][], ch: string) => {
  const rockLength = rock.length - 1;
  const { row, col } = position;

  rock.forEach((r, i) => {
    r.forEach((c, j) => {
      // grid[row + i - rockLength][col + j] = c === "." ? "." : ch;
      if (grid[row + i - rockLength][col + j] !== "#") {
        grid[row + i - rockLength][col + j] = c === "." ? "." : ch;
      }
    });
  });
};

const isValidIntersection = (
  { row, col }: { row: number; col: number },
  rock: string[][]
) => {
  const w = rock[0].length;
  const h = rock.length;

  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const ch = grid[row - r][col + c];
      const rCh = rock[h - r - 1][c];

      if (ch !== "." && rCh !== "." && ch !== "@") {
        return false;
      }
    }
  }

  return true;
};

const shiftRock = (rock: string[][]) => {
  const currGust = gust[gInd++];
  if (gInd >= gust.length) gInd = 0;

  const { col } = position;

  if (currGust === ">") {
    if (col + rock[0].length <= WIDTH - 1) {
      const valid = isValidIntersection(
        {
          row: position.row,
          col: position.col + 1,
        },
        rock
      );
      if (!valid) return;

      drawRock(rock, ".");
      position.col++;
      drawRock(rock, "@");
      return;
    }
  }
  if (currGust === "<") {
    if (col >= 1) {
      const valid = isValidIntersection(
        {
          row: position.row,
          col: position.col - 1,
        },
        rock
      );

      if (!valid) return;

      drawRock(rock, ".");
      position.col--;
      drawRock(rock, "@");
      return;
    }
  }
};

const fallDown = (rock: string[][]) => {
  if (position.row + 1 >= grid.length) return false;

  const isValid = isValidIntersection(
    {
      row: position.row + 1,
      col: position.col,
    },
    rock
  );
  if (!isValid) return false;

  drawRock(rock, ".");
  position.row++;
  drawRock(rock, "@");

  return true;
};

const run = (amount: number) => {
  let highestRock = 0;
  let offset = 0;

  for (let i = 0; i < amount; i++) {
    let currRock = rocks[i % rocks.length];

    const diff = 3 + currRock.length;
    grid = [
      ...Array(diff)
        .fill("")
        .map(() => Array(7).fill(".")),
      ...grid,
    ];

    position.row = 0 + currRock.length - 1;
    position.col = 2;
    drawRock(currRock, "@");

    let falling = true;
    while (falling) {
      shiftRock(currRock);

      const valid = fallDown(currRock);

      if (!valid) {
        drawRock(currRock, "#");
        falling = false;

        highestRock = grid.findIndex((row) => row.includes("#"));
        grid = grid.slice(highestRock);
      }
    }
  }

  return grid.length + offset;
};

console.log("Part 1: ", run(2022));
// console.log("Part 1: ", run(272));
// printGrid();
