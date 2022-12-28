import { readInput } from "../helpers";

const useSample = true;

const rocks = [
  [["#", "#", "#", "#"]],
  [
    [".", "#", "."],
    ["#", "#", "#"],
    [".", "#", "."],
  ],
  [
    [".", ".", "#"],
    [".", ".", "#"],
    ["#", "#", "#"],
  ],
  [["#"], ["#"], ["#"], ["#"]],
  [
    ["#", "#"],
    ["#", "#"],
  ],
];

// globals
const WIDTH = 7;

const gusts = readInput(useSample, "");

// helpers
const printGrid = ({ grid }: { grid: string[][] }) => {
  grid.forEach((row) => {
    console.log(row.join(""));
  });

  console.log("\n");
};

type Position = { row: number; col: number };

const drawRock = ({
  grid,
  rock,
  ch,
  position,
}: {
  grid: string[][];
  rock: string[][];
  ch: string;
  position: Position;
}) => {
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

const isValidIntersection = ({
  grid,
  position: { row, col },
  rock,
}: {
  grid: string[][];
  position: Position;
  rock: string[][];
}) => {
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

const shiftRock = ({
  grid,
  rock,
  gust,
  position,
}: {
  grid: string[][];
  rock: string[][];
  gust: string;
  position: Position;
}) => {
  const { col } = position;

  if (gust === ">") {
    if (col + rock[0].length <= WIDTH - 1) {
      const valid = isValidIntersection({
        grid,
        position: {
          row: position.row,
          col: position.col + 1,
        },
        rock,
      });
      if (!valid) return;

      drawRock({ grid, rock, ch: ".", position });
      position.col++;
      drawRock({ grid, rock, ch: "@", position });

      return;
    }
  }
  if (gust === "<") {
    if (col >= 1) {
      const valid = isValidIntersection({
        grid,
        position: {
          row: position.row,
          col: position.col - 1,
        },
        rock,
      });

      if (!valid) return;

      drawRock({ grid, rock, ch: ".", position });
      position.col--;
      drawRock({ grid, rock, ch: "@", position });
      return;
    }
  }
};

const fallDown = ({
  grid,
  rock,
  position,
}: {
  grid: string[][];
  rock: string[][];
  position: Position;
}) => {
  if (position.row + 1 >= grid.length) return false;

  const isValid = isValidIntersection({
    grid,
    position: {
      row: position.row + 1,
      col: position.col,
    },
    rock,
  });
  if (!isValid) return false;

  drawRock({ grid, rock, ch: ".", position });
  position.row++;
  drawRock({ grid, rock, ch: "@", position });

  return true;
};

const getKey = (rockInd: number, gInd: number) => `${rockInd},${gInd}`;

const periodStart = gusts.length;

const run = (amount: number) => {
  let grid: string[][] = [];

  const heightCache = {};
  const position = { row: 0, col: 0 };

  let gInd = 0;
  let periodInd = 0;
  let highestRock = 0;
  let towerHeight = 0;
  let offset = 0;

  for (let i = 0; i < amount; i++) {
    let oldLength = grid.length;
    let rockInd = i % rocks.length;
    let currRock = rocks[rockInd];

    const key = getKey(rockInd, gInd);
    if (heightCache[key]) {
      if (!periodInd) periodInd = i;
      offset += heightCache[key].diff;
      gInd = heightCache[key].gInd;
      continue;
    }

    const diff = 3 + currRock.length;
    grid = [
      ...Array(diff)
        .fill("")
        .map(() => Array(7).fill(".")),
      ...grid,
    ];

    position.row = 0 + currRock.length - 1;
    position.col = 2;
    drawRock({ grid, rock: currRock, ch: "@", position });

    let falling = true;
    let gustStartInd = gInd;

    while (falling) {
      const currGust = gusts[gInd++];
      if (gInd >= gusts.length) gInd = 0;

      shiftRock({ grid, rock: currRock, gust: currGust, position });

      const valid = fallDown({ grid, rock: currRock, position });

      if (!valid) {
        drawRock({ grid, rock: currRock, ch: "#", position });
        falling = false;

        highestRock = grid.findIndex((row) => row.includes("#"));
        grid = grid.slice(highestRock);

        if (i > periodStart) {
          heightCache[getKey(rockInd, gustStartInd)] = {
            diff: grid.length - oldLength,
            gInd,
          };
        }
        towerHeight = grid.length;
      }
    }
  }

  return {
    towerHeight: towerHeight + offset,
    periodInd,
    period: Object.keys(heightCache).length,
    periodHeight: Object.keys(heightCache).reduce(
      (acc, key) => acc + heightCache[key].diff,
      0
    ),
  };
};

const { periodInd, period, periodHeight } = run(periodStart * 2);

const run2 = (amount: number) => {
  if (periodInd > amount) return run(amount).towerHeight;

  const { towerHeight: initialHeight } = run(periodInd);
  const newAmount = amount - periodInd;

  const count = Math.floor(newAmount / period);
  const rem = newAmount % period;

  const remHeight = run(periodInd + rem).towerHeight - initialHeight;

  return initialHeight + count * periodHeight + remHeight;
};

console.log("Part 1: ", run2(2022));
console.log("Part 2: ", run2(1000000000000));
