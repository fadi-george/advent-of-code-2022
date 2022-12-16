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
    // /Valve ([a-zA-Z]+) .* (\d+) .* valves: ([a-zA-Z],?)/
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

const valveNames = Object.keys(valves);
const startMins = 30;

const traverse = (item, remaining) => {
  if (item.minutes <= 0) return item;

  const remainingValves = new Set(remaining);
  remainingValves.delete(item.valve);

  const flowRate = valves[item.valve].flowRate;
  let mins = item.minutes;
  let pressure = 0;

  if (flowRate) {
    mins--;
    pressure = flowRate * mins;
  }

  if (mins > 0) {
    const newPressure = item.pressure + pressure;
    // if (newPressure > maxPressure) {
    //   maxPressure = newPressure;
    // }

    const pressures = [...remainingValves].map((valve) => {
      const [, dist] = findPathWithCost(graph, item.valve, valve);
      const someItem = traverse(
        {
          valve,
          minutes: mins - dist,
          pressure: newPressure,
        },
        remainingValves
      );
      return someItem.pressure;
    });

    pressure = Math.max(...pressures);
  }

  item.pressure = pressure;
  return item;
};

const item = traverse(
  {
    valve: "AA",
    minutes: startMins,
    pressure: 0,
  },
  new Set(valveNames)
);

console.log("Max pressure:", item.pressure);
