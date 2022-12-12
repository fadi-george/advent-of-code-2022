import { readInput } from "../helpers";
import { findPathWithCost } from "../dijkstra";

const input = readInput();

const map: string[][] = [];
const starts: string[] = [];
let start = "";
let end = "";

const graph = {};
input.forEach((line, r) => {
  const row = line.split("");
  map.push(
    row.map((char, c) => {
      graph[`${r},${c}`] = {};

      if (char === "S") {
        starts.push(`${r},${c}`);
        start = `${r},${c}`;
        return "a";
      }
      if (char === "a") {
        starts.push(`${r},${c}`);
      }
      if (char === "E") {
        end = `${r},${c}`;
        return "z";
      }
      return char;
    })
  );
});

map.forEach((row, r) => {
  row.forEach((char, c) => {
    const curr = char.charCodeAt(0);

    [
      [r, c + 1], // right
      [r + 1, c], // down
      [r - 1, c], // up
      [r, c - 1], // left
    ].forEach(([nr, nc]) => {
      const adjacent = map[nr]?.[nc];

      if (adjacent) {
        const next = adjacent.charCodeAt(0);

        if (next <= curr || curr + 1 === next) {
          graph[`${r},${c}`][`${nr},${nc}`] = 1;
        }
      }
    });
  });
});

// Part 1
const [, steps] = findPathWithCost(graph, start, end);
console.log("Steps:", steps);

const paths: number[] = [];
starts.forEach((start) => {
  try {
    const [_, path] = findPathWithCost(graph, start, end);
    paths.push(path);
  } catch {}
});

// Part 2
console.log("Steps:", Math.min(...paths));
