import { readInput } from "../helpers"

const p1Items: number[][] = []
const p2Items: number[][] = []
const p1Inspected: number[] = []
const p2Inspected: number[] = []

const input = readInput(true)
const monkeys: {
  ifFalse: number
  ifTrue: number
  op: (x: number) => number
  test: number
}[] = []

let monkeyId: number
input.forEach((line) => {
  const monkeyMatch = line.match(/Monkey (\d+):/)
  const op = line.match(/Operation: new = (.*)/)
  const test = line.match(/Test: divisible by (\d+)/)
  const ifTrue = line.match(/If true: throw to monkey (\d+)/)
  const ifFalse = line.match(/If false: throw to monkey (\d+)/)

  if (monkeyMatch) {
    monkeyId = Number(monkeyMatch[1])
    p1Inspected[monkeyId] = 0
    p2Inspected[monkeyId] = 0
    monkeys[monkeyId] = {
      ifFalse: 0,
      ifTrue: 0,
      op: (x) => x,
      test: 0,
    }
  } else if (/Starting items:/.test(line)) {
    const startingItems = line.match(/(\d+)/g)?.map(Number)
    if (startingItems) {
      p1Items.push(startingItems.slice())
      p2Items.push(startingItems.slice())
    }
  } else if (op) {
    const [op1, operand, op2] = op[1].split(" ")
    monkeys[monkeyId].op = (old) => {
      let value1 = op1 === "old" ? old : Number(op1)
      let value2 = op2 === "old" ? old : Number(op2)

      if (operand === "+") {
        return value1 + value2
      }
      return value1 * value2
    }
  } else if (test) {
    monkeys[monkeyId].test = Number(test[1])
  } else if (ifTrue) {
    monkeys[monkeyId].ifTrue = Number(ifTrue[1])
  } else if (ifFalse) {
    monkeys[monkeyId].ifFalse = Number(ifFalse[1])
  }
})

const getMonkeyBusiness = (counts: number[]) => {
  const topTwoInspectCounts = counts.sort((a, b) => b - a).slice(0, 2)
  return topTwoInspectCounts.reduce((acc, curr) => acc * curr, 1)
}

// part 1
let round = 1
while (round++ <= 20) {
  p1Items.forEach((items, id) => {
    const monkey = monkeys[id]

    const length = items.length
    for (let i = 0; i < length; i++, p1Inspected[id]++) {
      const [item] = items.splice(0, 1)
      const worryLevel = Math.floor(monkey.op(item) / 3)

      const nextMonkey =
        worryLevel % monkey.test === 0 ? monkey.ifTrue : monkey.ifFalse
      p1Items[nextMonkey].push(worryLevel)
    }
  })
}
logP1(getMonkeyBusiness(p1Inspected))

// part 2
const lcm = Object.values(monkeys).reduce((acc, m) => acc * m.test, 1)

round = 1
while (round++ <= 10000) {
  p2Items.forEach((items, id) => {
    const monkey = monkeys[id]

    const length = items.length
    for (let i = 0; i < length; i++, p2Inspected[id]++) {
      const [item] = items.splice(0, 1)
      const worryLevel = monkey.op(item) % lcm

      const nextMonkey =
        worryLevel % monkey.test === 0 ? monkey.ifTrue : monkey.ifFalse
      p2Items[nextMonkey].push(worryLevel)
    }
  })
}
logP2(getMonkeyBusiness(p2Inspected))
