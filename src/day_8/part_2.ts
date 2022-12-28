import { readInput } from "../helpers"

const input = readInput().map((line) => line.split("").map(Number))

let cols = input[0].length
let maxScenicCount = 0

for (let i = 1; i < input.length - 1; i++) {
  for (let j = 1; j < cols - 1; j++) {
    let curr = input[i][j]

    const slices = [
      input
        .slice(0, i)
        .map((row) => row[j])
        .reverse(), // top
      input[i].slice(0, j).reverse(), // left
      input.slice(i + 1).map((row) => row[j]), // bottom
      input[i].slice(j + 1), // right
    ]

    const counts = slices.map((slice) => {
      let count = 0
      slice.some((num) => {
        count++
        return num >= curr
      })
      return count
    })

    const sc = counts.reduce((acc, count) => acc * count, 1)
    if (sc > maxScenicCount) maxScenicCount = sc
  }
}

logP2(maxScenicCount)
