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

const distances = input.forEach((path) => {
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
      if (!distances[name]) distances[name] = {};
      distances[name][valve] = 1;

      if (!graph[name]) graph[name] = {};
      graph[name][valve] = 1;
    });
  }
});

const valveNames = Object.keys(valves);
const startMins = 30;

const queue = [
  {
    valve: "AA",
    minutes: startMins,
    pressure: 0,
    unvisited: new Set(valveNames),
    path: [] as string[],
  },
];

let maxPressure = 0;
const cache = {};

const checkCache = (path: string[], pressure: number) => {
  const temp = path.slice().sort();
  const key = temp.join(",");

  let cacheHit = false;
  if (cache[key] && cache[key] === pressure) {
    cacheHit = true;
  } else {
    cache[key] = pressure;
  }

  return cacheHit;
};

while (queue.length) {
  queue.sort((a, b) => b.pressure - a.pressure).slice(0, 1000);
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

    if (checkCache(item.path, item.pressure + pressure)) continue;

    if (mins > 0) {
      const newPressure = item.pressure + pressure;
      if (newPressure > maxPressure) {
        maxPressure = newPressure;
      }

      [...remainingValves].forEach((valve) => {
        const [, dist] = findPathWithCost(graph, item.valve, valve);
        queue.push({
          valve,
          minutes: mins - dist,
          pressure: newPressure,
          unvisited: remainingValves,
          path: [...item.path, item.valve],
        });
      });
    }
  }
}
console.log("Max pressure:", maxPressure);
