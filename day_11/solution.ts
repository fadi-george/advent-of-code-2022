import { readInput } from "../helpers";

const p1Items: number[][] = [];
const p2Items: number[][] = [];
const p1Inspected: number[] = [];
const p2Inspected: number[] = [];

const input = readInput(true);
const monkeys: {
  [key: number]: {
    ifFalse: number;
    ifTrue: number;
    op: (x: number) => number;
    test: number;
  };
} = {};

let monkeyId: keyof typeof monkeys;
input.forEach((line) => {
  const monkeyMatch = line.match(/Monkey (\d+):/);
  const op = line.match(/Operation: new = (.*)/);
  const test = line.match(/Test: divisible by (\d+)/);
  const ifTrue = line.match(/If true: throw to monkey (\d+)/);
  const ifFalse = line.match(/If false: throw to monkey (\d+)/);

  if (monkeyMatch) {
    monkeyId = Number(monkeyMatch[1]);
    p1Inspected[monkeyId] = 0;
    p2Inspected[monkeyId] = 0;
    monkeys[monkeyId] = {
      ifFalse: 0,
      ifTrue: 0,
      op: (x) => x,
      test: 0,
    };
  } else if (/Starting items:/.test(line)) {
    const startingItems = line.match(/(\d+)/g)?.map(Number);
    if (startingItems) {
      p1Items.push(startingItems.slice(0));
      p2Items.push(startingItems.slice(0));
    }
  } else if (op) {
    const [op1, operand, op2] = op[1].split(" ");
    monkeys[monkeyId].op = (old) => {
      let value1 = op1 === "old" ? old : Number(op1);
      let value2 = op2 === "old" ? old : Number(op2);

      if (operand === "+") {
        return value1 + value2;
      }
      return value1 * value2;
    };
  } else if (test) {
    monkeys[monkeyId].test = Number(test[1]);
  } else if (ifTrue) {
    monkeys[monkeyId].ifTrue = Number(ifTrue[1]);
  } else if (ifFalse) {
    monkeys[monkeyId].ifFalse = Number(ifFalse[1]);
  }
});

const getMonkeyBusiness = (counts: number[]) => {
  let topTwoInspectCounts = counts.sort((a, b) => b - a).slice(0, 2);
  let monkeyBusiness = topTwoInspectCounts.reduce((acc, curr) => acc * curr, 1);
  return monkeyBusiness;
};

// part 1
let round = 1;
while (round <= 20) {
  p1Items.forEach((items, monkeyId) => {
    const monkey = monkeys[monkeyId];

    const length = items.length;
    for (let i = 0; i < length; i++) {
      p1Inspected[monkeyId]++;
      const [item] = items.splice(0, 1);

      let worryLevel = monkey.op(item);
      worryLevel = Math.floor(worryLevel / 3);

      const nextMonkeyId =
        worryLevel % monkey.test === 0 ? monkey.ifTrue : monkey.ifFalse;
      p1Items[nextMonkeyId].push(worryLevel);
    }
  });

  round++;
}
console.log(getMonkeyBusiness(p1Inspected));

// part 2
const lcm = Object.values(monkeys).reduce((acc, m) => acc * m.test, 1);

round = 1;
while (round <= 10000) {
  p2Items.forEach((items, monkeyId) => {
    const monkey = monkeys[monkeyId];

    const length = items.length;
    for (let i = 0; i < length; i++) {
      p2Inspected[monkeyId]++;
      const [item] = items.splice(0, 1);

      let worryLevel = monkey.op(item);
      worryLevel = worryLevel % lcm;

      const nextMonkeyId =
        worryLevel % monkey.test === 0 ? monkey.ifTrue : monkey.ifFalse;
      p2Items[nextMonkeyId].push(worryLevel);
    }
  });

  round++;
}
console.log(getMonkeyBusiness(p2Inspected));
