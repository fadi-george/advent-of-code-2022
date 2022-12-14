import { readInput } from "../helpers"

const input = readInput().concat([""])
const totals: number[] = []

let elfIndex = 0
let total = 0
let maxCalories = 0
input.forEach((calories, index) => {
  if (calories === "") {
    if (total > maxCalories) maxCalories = total
    totals[elfIndex] = total
    elfIndex++
    total = 0
  } else {
    total += parseInt(calories)
  }
})

const top3Calories = totals
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((a, b) => a + b, 0)

logP2(top3Calories)
