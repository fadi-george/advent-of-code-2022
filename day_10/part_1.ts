import { readInput } from "../helpers";

const input = readInput().map((line) => line.split(" "));

let x = 1;
let signalStrength: { during; end }[] = [];

input.forEach((line) => {
  let op = line[0];

  switch (op) {
    case "noop": {
      signalStrength.push({ during: x, end: x });
      break;
    }
    case "addx": {
      let amt = Number(line[1]);
      signalStrength.push({ during: x, end: x });
      signalStrength.push({ during: x, end: x + amt });
      x += amt;
      break;
    }
  }
});

const total = [20, 60, 100, 140, 180, 220].reduce(
  (acc, curr) => acc + signalStrength[curr - 1].during * curr,
  0
);

console.log(total);
