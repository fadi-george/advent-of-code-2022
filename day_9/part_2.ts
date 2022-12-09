import { readInput } from "../helpers";

const grid: Record<string, string | undefined> = {};
const visited: Record<string, number> = {
  "0,0": 1,
};

const segments = [...Array(10).fill(0)].map(() => ({
  row: 0,
  col: 0,
}));

const getKey = ({ row, col }: { row: number; col: number }) => `${row},${col}`;

const setGridKey = (
  seg: { row: number; col: number },
  value: string | undefined = undefined
) => {
  if (grid[getKey(seg)] !== "H") {
    grid[getKey(seg)] = value;
  }
};

const printMap = (map: Record<string, any>) => {
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
      const key = getKey({ row, col });

      if (key === "0,0") line += "s";
      else {
        line += map[key] || ".";
      }
    }
    console.log(line);
  }
  console.log("\n=========\n");
};

const input = readInput().map((line) => line.split(" "));

input.forEach((line) => {
  let dir = line[0];
  let count = Number(line[1]);
  let t = 0;

  for (let i = 0; i < count; i++) {
    const root = segments[0];
    grid[getKey(root)] = undefined;

    if (dir === "R") root.col += 1;
    else if (dir === "U") root.row -= 1;
    else if (dir === "L") root.col -= 1;
    else if (dir === "D") root.row += 1;

    grid[getKey(root)] = "H";

    for (t = 1; t < segments.length; t++) {
      const head = segments[t - 1];
      let seg = segments[t];
      let marker = t === 0 ? "H" : String(t);

      setGridKey(seg);

      let wDiff = head.col - seg.col;
      let hDiff = head.row - seg.row;

      if (Math.abs(wDiff) > 1 || Math.abs(hDiff) > 1) {
        if (wDiff > 0) seg.col++;
        else if (wDiff < 0) seg.col--;

        if (hDiff > 0) seg.row++;
        else if (hDiff < 0) seg.row--;
      }

      setGridKey(seg, marker);

      if (t === segments.length - 1) {
        visited[getKey(seg)] = 1;
        // printMap(grid);
      }
    }
  }
});

let visitedCount = Object.values(visited).reduce((acc, val) => acc + val, 0);
// printMap(visited);
console.log(visitedCount);
