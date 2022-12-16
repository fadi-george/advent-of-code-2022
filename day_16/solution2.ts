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
let queue = [
  {
    valve: "AA",
    minutes: 30,
    pressure: 0,
    unvisited: new Set(valvesWithFlow),
  },
];

let maxPressure = 0;

while (queue.length) {
  queue = queue.sort((a, b) => b.pressure - a.pressure);
  const item = queue.shift();

  if (item) {
    if (item.minutes <= 0) continue;

    const remainingValves = new Set(item.unvisited);
    remainingValves.delete(item.valve);

    const flowRate = valves[item.valve].flowRate;
    let mins = item.minutes;
    let pressure = 0;

    if (flowRate) {
      mins--;
      pressure = flowRate * mins;
    }

    if (mins >= 0) {
      const newPressure = item.pressure + pressure;
      if (newPressure > maxPressure) {
        maxPressure = newPressure;
      }

      [...remainingValves].forEach((valve) => {
        const dist = distances[item.valve][valve];
        queue.push({
          valve,
          minutes: mins - dist,
          pressure: newPressure,
          unvisited: remainingValves,
        });
      });
    }
  }
}
console.log("Max pressure:", maxPressure);

// part 2
let p2Queue = [
  {
    valves: ["AA", "AA"],
    minutes: [26, 26],
    pressure: 0,
    unvisited: new Set(valvesWithFlow),
    opened: new Set(),
  },
];
maxPressure = 0;

console.time("P2");
while (p2Queue.length) {
  p2Queue = p2Queue.sort((a, b) => b.pressure - a.pressure);
  const item = p2Queue.shift();

  if (item) {
    const remainingValves = new Set(item.unvisited);
    const opened = new Set(item.opened);

    if (item.minutes.every((m) => m <= 0)) continue;

    const [p1, p2] = item.valves.map((valve, index) => {
      remainingValves.delete(valve);
      const flowRate = valves[valve].flowRate;
      let mins = item.minutes[index];

      if (flowRate && mins > 0 && !opened.has(valve)) {
        opened.add(valve);
        mins--;
        item.minutes[index] = mins;
        return flowRate * mins;
      }
      return 0;
    });

    const newPressure = item.pressure + p1 + p2;
    if (newPressure > maxPressure) {
      maxPressure = newPressure;
    }

    const [v1, v2] = item.valves;
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
        });
      }
    }
  }
}
console.log("Max pressure:", maxPressure);
console.timeEnd("P2");
