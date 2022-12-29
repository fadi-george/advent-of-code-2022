import { keyToPoint, pointToKey, readInput } from "../helpers"

const input = readInput(false)
const grid = new Set<string>()

input.forEach((line) => {
  grid.add(line)
})

const pocketSet = new Set<string>()

const getNeighbors = (x: number, y: number, z: number) => [
  [x - 1, y, z], // left
  [x + 1, y, z], // right
  [x, y - 1, z], // top
  [x, y + 1, z], // bottom
  [x, y, z - 1], // front
  [x, y, z + 1], // back
]

let min = [Infinity, Infinity, Infinity]
let max = [-Infinity, -Infinity, -Infinity]

const gridArr = [...grid]
const total = gridArr.reduce((acc, point) => {
  const [x, y, z] = point.split(",").map(Number)

  min = [Math.min(min[0], x), Math.min(min[1], y), Math.min(min[2], z)]
  max = [Math.max(max[0], x), Math.max(max[1], y), Math.max(max[2], z)]

  let surfaceArea = 6

  const neighbors = getNeighbors(x, y, z)
  neighbors.forEach(([i, j, k]) => {
    const newPoint = pointToKey(i, j, k)

    if (grid.has(newPoint)) {
      surfaceArea--
    } else {
      pocketSet.add(newPoint)
    }
  })

  return acc + surfaceArea
}, 0)

// Part 1
logP1(total)

// Part 2
// Expand the grid by 1 in all directions for leeway
min = [min[0] - 1, min[1] - 1, min[2] - 1]
max = [max[0] + 1, max[1] + 1, max[2] + 1]

const outsideSet = new Set<string>()
const queue = [
  {
    x: min[0],
    y: min[1],
    z: min[2],
  },
]

// Get points that are outside the blocks
while (queue.length) {
  const item = queue.shift()

  if (!item) continue

  const { x, y, z } = item
  const neighbors = getNeighbors(x, y, z)

  neighbors.forEach(([i, j, k]) => {
    const newPoint = pointToKey(i, j, k)

    if (i < min[0] || i > max[0]) return
    if (j < min[1] || j > max[1]) return
    if (k < min[2] || k > max[2]) return
    if (grid.has(newPoint) || outsideSet.has(newPoint)) return

    outsideSet.add(newPoint)
    queue.push({ x: i, y: j, z: k })
  })
}

// Remove points neighbors that are on the outside
;[...pocketSet].forEach((point) => {
  if (outsideSet.has(point)) pocketSet.delete(point)
})

const pocketArea = [...pocketSet].reduce((acc, point) => {
  const [x, y, z] = keyToPoint(point)
  const neighbors = getNeighbors(x, y, z)
  const area = neighbors.reduce(
    (acc, [i, j, k]) => acc + (grid.has(pointToKey(i, j, k)) ? 1 : 0),
    0
  )

  return acc + area
}, 0)

logP2(total - pocketArea)
