import { readInput } from "../helpers"

const input = readInput(true).map((line) => line.split("").map(Number))

const cols = input[0].length
let visibleCount = input.length * 2 + (cols - 2) * 2

for (let i = 1; i < input.length - 1; i++) {
  for (let j = 1; j < cols - 1; j++) {
    const slices = [
      input.slice(0, i).map((row) => row[j]), // top
      input.slice(i + 1).map((row) => row[j]), // bottom
      input[i].slice(0, j), // left
      input[i].slice(j + 1), // right
    ]

    slices.some(
      (slice) =>
        slice.filter((num) => num < input[i][j]).length === slice.length &&
        visibleCount++
    )
  }
}

logP1(visibleCount)
