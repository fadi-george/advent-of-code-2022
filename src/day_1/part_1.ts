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

logP1(maxCalories)
