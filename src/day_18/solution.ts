import { pointToKey, readInput } from "../helpers"

const input = readInput(false)
const grid = new Set<string>()

input.forEach((line) => {
  grid.add(line)
})

const gridArr = [...grid]
const total = gridArr.reduce((acc, point) => {
  const [x, y, z] = point.split(",").map(Number)

  let surfaceArea = 6

  const neighbors = [
    [x - 1, y, z], // left
    [x + 1, y, z], // right
    [x, y - 1, z], // top
    [x, y + 1, z], // bottom
    [x, y, z - 1], // front
    [x, y, z + 1], // back
  ]
  neighbors.forEach(([i, j, k]) => {
    const newPoint = pointToKey(i, j, k)
    if (grid.has(newPoint)) {
      surfaceArea--
    }
  })

  return acc + surfaceArea
}, 0)

logP1(total)
