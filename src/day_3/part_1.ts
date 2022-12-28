import { readInput } from "../helpers"

const input = readInput()

// Find the item type that appears in both compartments of each rucksack. What is the sum of the priorities of those item types?
const total = input.reduce((total, line) => {
  const firstHalf = new Set(line.slice(0, line.length / 2))
  const secondHalf = new Set(line.slice(line.length / 2))

  const commonLetters = [...firstHalf].filter((x) => secondHalf.has(x))

  const priorities = commonLetters.map((letter) => {
    if (letter === letter.toLowerCase()) return letter.charCodeAt(0) - 96
    return letter.charCodeAt(0) - 38
  })

  return total + priorities.reduce((a, b) => a + b, 0)
}, 0)

logP1(total)
