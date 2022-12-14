import { readInput } from "../helpers";

const input = readInput(true, "\n");
const grid: string[][] = [[]];
grid[0][500] = "";

let maxY = -Infinity;
let minX = Infinity;
let maxX = -Infinity;

const printGrid = ({ startCol = minX, endCol = maxX, endRow = maxY } = {}) => {
  let res = "";

  for (let r = 0; r < grid.length; r++) {
    let rowStr = "";
    let row = grid[r];
    if (!row) row = [];

    for (let i = startCol; i <= endCol; i++) {
      rowStr += row[i] || ".";
    }
    res += rowStr + "\n";
  }
  console.log(res);
};

input.forEach((path) => {
  const coords = path
    .split(" -> ")
    .map((coord) => coord.split(",").map(Number));

  let prevX;
  let prevY;

  coords.forEach((coord) => {
    const [x, y] = coord;

    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;

    if (!grid[y]) grid[y] = [];
    grid[y][x] = "#";

    if (prevX !== undefined && prevY !== undefined) {
      if (prevX === x) {
        if (prevY <= y) {
          for (let i = prevY + 1; i <= y; i++) {
            if (!grid[i]) grid[i] = [];
            grid[i][x] = "#";
          }
        } else {
          for (let i = prevY - 1; i >= y; i--) {
            if (!grid[i]) grid[i] = [];
            grid[i][x] = "#";
          }
        }
      } else {
        if (prevX <= x) {
          for (let i = prevX + 1; i <= x; i++) {
            grid[y][i] = "#";
          }
        } else {
          for (let i = prevX - 1; i >= x; i--) {
            grid[y][i] = "#";
          }
        }
      }
    }
    prevX = x;
    prevY = y;
  });
});

// fill gaps
let groundRow = maxY + 2;
grid[groundRow] = [];
for (let r = 0; r <= groundRow; r++) {
  let row = grid[r];
  if (!row) row = [];
  else if (r === groundRow) {
    row = [...Array(maxX + 1).fill("#")];
  }

  for (let c = 0; c <= maxX; c++) {
    row[c] = row[c] || "";
  }
  grid[r] = row;
}

const start = [500, 0];
let steps = 0;

let part1Done = false;
let part2Done = false;
let part1Steps = 0;
let part2Steps = 0;

let part2MinX = Infinity;
let part2MaxX = -Infinity;

while (1) {
  let row = start[1];
  let col = start[0];
  grid[row][col] = "+";

  while (1) {
    row++;

    if (!part1Done && (row > maxY || col < minX || col > maxX)) {
      printGrid();
      part1Done = true;
    }

    let left = grid[row][col - 1];
    let right = grid[row][col + 1];
    let bottom = grid[row][col];

    if (col < part2MinX) part2MinX = col;
    if (col > part2MaxX) part2MaxX = col;

    if (row === 1 && col === 500 && left && right && bottom) {
      grid[start[1]][start[0]] = "o";
      printGrid({
        startCol: part2MinX - 1,
        endCol: part2MaxX + 1,
        endRow: groundRow,
      });
      part2Done = true;
      steps++;
      break;
    } else if (row === groundRow) {
      if (!left) {
        left = "#";
        grid[row][col - 1] = "#";
      }
      if (!right) {
        right = "#";
        grid[row][col + 1] = "#";
      }
      if (!bottom) {
        bottom = "#";
        grid[row][col] = "#";
      }
    }

    if (bottom) {
      if (!left) {
        col--;
      } else if (!right) {
        col++;
      } else {
        grid[row - 1][col] = "o";
        break;
      }
    }
  }

  if (part1Done && !part1Steps) {
    part1Steps = steps;
  }
  if (part2Done) {
    part2Steps = steps;
    break;
  }
  steps++;
}

console.log("Part 1: ", part1Steps);
console.log("Part 2: ", part2Steps);
