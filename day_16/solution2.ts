import { printObject, readInput } from "../helpers";
import { findPathWithCost } from "../dijkstra";

const useSample = true;
const input = readInput(useSample);

const graph = {};
const valves: Record<
  string,
  {
    flowRate: number;
    tunnels: string[];
  }
> = {};

input.forEach((path) => {
  const match = path.match(
    /Valve ([\w]+) has flow rate=(\d+); tunnels? leads? to valves? (.*)/
  );

  if (match) {
    const [, name, flowRate, others] = match;
    const otherValves = others.split(", ");

    valves[name] = {
      flowRate: Number(flowRate),
      tunnels: otherValves,
    };
    otherValves.forEach((valve) => {
      if (!graph[name]) graph[name] = {};
      graph[name][valve] = 1;
    });
  }
});

// get optimal distance between each valve
const distances = {};
const valveNames = Object.keys(valves);
valveNames.forEach((valve) => {
  valveNames.forEach((valve2) => {
    if (valve !== valve2) {
      const [, dist] = findPathWithCost(graph, valve, valve2);
      if (!distances[valve]) distances[valve] = {};
      if (!distances[valve2]) distances[valve2] = {};
      distances[valve][valve2] = dist;
      distances[valve2][valve] = dist;
    }
  });
});

// don't need to visit valves with no flow rate
const valvesWithFlow = valveNames.filter((valve) => valves[valve].flowRate);

const getSinglePath = (start) => {
  let maxPressure = 0;
  let bestPath = [];
  let queue = [start];

  while (queue.length) {
    queue = queue.sort((a, b) => b.pressure - a.pressure);
    const item = queue.shift();

    if (item) {
      if (item.minutes <= 0) {
        continue;
      }

      const remainingValves = new Set(item.unvisited);
      const opened = new Set(item.opened);
      remainingValves.delete(item.valve);

      const flowRate = valves[item.valve].flowRate;
      let mins = item.minutes;
      let pressure = 0;

      if (flowRate) {
        mins--;
        pressure = flowRate * mins;
        opened.add(item.valve);
      }

      if (mins > 0) {
        const newPressure = item.pressure + pressure;
        if (newPressure > maxPressure) {
          maxPressure = newPressure;
          bestPath = item.paths;
        }

        [...remainingValves].forEach((valve) => {
          const dist = distances[item.valve][valve];
          queue.push({
            valve,
            minutes: mins - dist,
            opened,
            pressure: newPressure,
            unvisited: remainingValves,
            path: [...item.path, item.valve],
          });
        });
      }
    }
  }

  return { maxPressure, path: bestPath };
};
// console.time("bfs");
console.log(
  "Part 1:",
  getSinglePath({
    minutes: 30,
    opened: new Set(),
    path: [],
    pressure: 0,
    unvisited: new Set(valvesWithFlow),
    valve: "AA",
  }).maxPressure
);
// console.timeEnd("bfs");

// console.time("dfs");
let maxPressure = 0;
const possiblePaths: { path: string[]; pressure: number }[] = [];

const dfs = (item) => {
  if (item.minutes <= 0) {
    possiblePaths.push({
      path: item.path,
      pressure: item.pressure,
    });
    return;
  }

  const remainingValves = new Set(item.unvisited);
  const opened = new Set(item.opened);
  remainingValves.delete(item.valve);

  const flowRate = valves[item.valve].flowRate;
  let mins = item.minutes;
  let pressure = 0;

  if (flowRate) {
    mins--;
    pressure = flowRate * mins;
    opened.add(item.valve);
  }

  if (mins > 0) {
    const newPressure = item.pressure + pressure;
    if (newPressure > maxPressure) {
      maxPressure = newPressure;
    }

    if (remainingValves.size == 0) {
      possiblePaths.push({
        path: [...item.path, item.valve],
        pressure: newPressure,
      });
    }

    [...remainingValves].forEach((valve) => {
      const dist = distances[item.valve][valve];
      dfs({
        minutes: mins - dist,
        opened,
        path: [...item.path, item.valve],
        pressure: newPressure,
        unvisited: remainingValves,
        valve,
      });
    });
  }
};

// part 2
dfs({
  valves: "AA",
  minutes: 26,
  unv: new Set(),
  pressure: 0,
  unvisited: new Set(valveNames),
  path: [],
});

// console.log(possiblePaths.length);
// for (let i = 0; i < possiblePaths.length; i++) {
//   for (let j = i + 1; j < possiblePaths.length; j++) {
//     const { path: path1, pressure: score1 } = possiblePaths[i];
//     const { path: path2, pressure: score2 } = possiblePaths[j];
//     const valves1 = new Set(path1.slice(1));
//     // const valves2 = new Set(path2.slice(1));

//     // const maxLen = Math.max(path1.length, path2.length);

//     // let count = 1;
//     // for (let k = 1; k < maxLen; k++) {
//     //   if (path1[k] !== path2[k]) {
//     //     count++;
//     //   } else {
//     //     break;
//     //   }
//     // }
//     let count = 0;
//     for (let k = 1; k < path2.length; k++) {
//       if (valves1.has(path2[k])) {
//         count++;
//       }
//     }

//     if (count === 0) {
//       printObject({
//         count,
//         path1,
//         path2,
//       });
//     }

//     // const sameValves = path1.path.filter((valve) => path2.path.includes(valve));
//     // if (sameValves.length === 0) {
//     //   console.log(path1.pressure + path2.pressure);
//     // }
//   }
// }
