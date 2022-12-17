import { readInput } from "../helpers";
import { findPathWithCost } from "../dijkstra";

const useSample = false;
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
      if (item.minutes <= 0) continue;

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

      if (mins >= 0) {
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
            paths: [...item.paths, item.valve],
          });
        });
      }
    }
  }

  return { maxPressure, path: bestPath };
};
console.log(
  "Max pressure: ",
  getSinglePath({
    minutes: 30,
    opened: new Set(),
    pressure: 0,
    unvisited: new Set(valvesWithFlow),
    valve: "AA",
    paths: [],
  }).maxPressure
);

// part 2
// const bestPath = getSinglePath({
//   minutes: 26,
//   opened: new Set(),
//   pressure: 0,
//   unvisited: new Set(valvesWithFlow),
//   valve: "AA",
//   paths: [],
// }).path;

const pathDebug = {};
const pathScore = {};
// const lenCheck = valvesWithFlow.length / 2;
const lenCheck = 8;

const get2Path = () => {
  let maxPressure = 0;

  let p2Queue = [
    {
      minutes: [26, 26],
      opened: new Set(),
      paths: [["AA"], ["AA"]],
      pressure: 0,
      unvisited: new Set(valvesWithFlow),
      valves: ["AA", "AA"],
    },
  ];

  while (p2Queue.length) {
    p2Queue = p2Queue.sort((a, b) => b.pressure - a.pressure);
    const item = p2Queue.shift();

    if (item) {
      const minutes = item.minutes;

      const len = Math.max(item.paths[0].length, item.paths[1].length);
      if (pathScore[len] === undefined) pathScore[len] = 0;

      if (minutes.every((m) => m <= 0)) continue;

      const remainingValves = new Set(item.unvisited);
      const opened = new Set(item.opened);

      const pressures = item.valves.map((valve, index) => {
        remainingValves.delete(valve);
        if (minutes[index] > 0) {
          const flowRate = valves[valve].flowRate;
          let mins = minutes[index];
          if (flowRate && mins > 0 && !opened.has(valve)) {
            opened.add(valve);
            mins--;
            minutes[index] = mins;
            return flowRate * mins;
          }
        }
        return 0;
      });

      let newPressure = item.pressure + pressures[0] + pressures[1];
      if (newPressure > maxPressure) {
        maxPressure = newPressure;
        pathScore[len] = newPressure;
      }
      if (len > lenCheck && newPressure < pathScore[len]) {
        continue;
      }

      let singleP1 = 0;
      let singleP2 = 0;

      if (minutes[0] > 0 && minutes[1] > 0) {
        let [v1, v2] = item.valves;
        const remArr = [...remainingValves];

        for (let i = 0; i < remArr.length; i++) {
          for (let j = i + 1; j < remArr.length; j++) {
            const rv1 = remArr[i];
            const rv2 = remArr[j];
            const dist1 = distances[v1][rv1];
            const dist2 = distances[v1][rv2];
            const dist3 = distances[v2][rv1];
            const dist4 = distances[v2][rv2];

            // check combined min distance
            const valves = [...item.valves];
            valves[0] = rv1;
            valves[1] = rv2;
            let dist = [dist1, dist4];
            if (dist1 + dist4 >= dist2 + dist3) {
              dist = [dist2, dist3];
              valves[0] = rv2;
              valves[1] = rv1;
            }

            const minutes = [...item.minutes];
            minutes[0] -= dist[0];
            minutes[1] -= dist[1];

            p2Queue.push({
              valves,
              minutes,
              opened,
              pressure: newPressure,
              unvisited: remainingValves,
              paths: [
                [...item.paths[0], valves[0]],
                [...item.paths[1], valves[1]],
              ],
            });
          }
        }
      } else if (minutes[0] > 0) {
        singleP1 = getSinglePath({
          minutes: minutes[0],
          opened,
          pressure: 0,
          unvisited: remainingValves,
          paths: [],
          valve: item.valves[0],
        }).maxPressure;
      } else if (minutes[1] > 0) {
        singleP2 = getSinglePath({
          minutes: minutes[1],
          opened,
          pressure: 0,
          unvisited: remainingValves,
          valve: item.valves[1],
          paths: [],
        }).maxPressure;
      }

      newPressure = newPressure + singleP1 + singleP2;
      if (newPressure > maxPressure) {
        maxPressure = newPressure;
        pathScore[len] = newPressure;
      }
      if (len > lenCheck && newPressure < pathScore[len]) {
        continue;
      }
    }
  }

  return maxPressure;
};
console.log("Max pressure:", get2Path());
// // 1258 low
// // 2531 too low
// // 2596
// // 2786
// // 4456 too high
// 2542 wrong
// 2799 wrong
// 2896 wrong
