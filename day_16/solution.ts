import { readInput } from "../helpers";
import { findPathWithCost } from "../dijkstra";

const useSample = false;
const input = readInput(useSample);

const graph: Record<string, Record<string, number>> = {};
const distances: Record<string, Record<string, number>> = {};
const valves: Record<string, { flowRate: number }> = {};

input.forEach((line) => {
  const match = line.match(
    /Valve ([\w]+) has flow rate=(\d+); tunnels? leads? to valves? (.*)/
  );
  if (match) {
    const [, name, flowRate, others] = match;
    const otherValves = others.split(", ");

    valves[name] = {
      flowRate: Number(flowRate),
    };

    otherValves.forEach((valve) => {
      if (!graph[name]) graph[name] = {};
      graph[name][valve] = 1;
    });
  }
});

const flowValves = Object.keys(valves).filter(
  (valve) => valves[valve].flowRate
);

// get optimal distance between each valve
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

// get best flow rate for path for some time limit
const dfs = ({
  closedValves,
  pressure,
  time,
  valve,
}: {
  closedValves: Set<string>;
  pressure: number;
  time: number;
  valve: string;
}) => {
  if (time <= 0) return pressure;
  if (closedValves.size === 0) return pressure;

  let newTime = time;
  let newClosedValves = new Set(closedValves);
  let newPressure = pressure;

  const flowRate = valves[valve].flowRate;
  if (flowRate) {
    newTime--;

    // open valve and keep track of new pressure
    newPressure += flowRate * newTime;
  }
  newClosedValves.delete(valve);

  // get best flow rate for remaining valves
  const remainingValves = [...newClosedValves];
  let tempPressure = newPressure;

  remainingValves.forEach((valve2) => {
    // get distance to valve
    const distance = distances[valve][valve2];
    if (distance > newTime) return;

    // get best flow rate for path
    tempPressure = Math.max(
      dfs({
        closedValves: newClosedValves,
        pressure: newPressure,
        time: newTime - distance,
        valve: valve2,
      }),
      tempPressure
    );
  });

  return tempPressure;
};

// const valves =
const maxPressure = dfs({
  closedValves: new Set(flowValves),
  pressure: 0,
  time: 30,
  valve: "AA",
});
console.log("Part 1", maxPressure);

// Part 2
const length = flowValves.length;
const lim = 2 ** length;

let maxPressure2 = 0;
for (let i = 0; i < lim; i++) {
  const mask = i.toString(2).padStart(length, "0").split("").map(Number);

  // get combinations of separate valves
  const myValves = flowValves.filter((_, i) => !mask[i]);
  const elephantValves = flowValves.filter((_, i) => mask[i]);

  const p1 = dfs({
    closedValves: new Set(myValves),
    pressure: 0,
    time: 26,
    valve: "AA",
  });
  const p2 = dfs({
    closedValves: new Set(elephantValves),
    pressure: 0,
    time: 26,
    valve: "AA",
  });

  maxPressure2 = Math.max(maxPressure2, p1 + p2);
}

console.log("Part 2", maxPressure2);
