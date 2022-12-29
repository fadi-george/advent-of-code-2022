import { keyToPoint, pointToKey, readInput } from "../helpers"

const input = readInput(true)
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

let minX = Infinity
let maxX = -Infinity
let minY = Infinity
let maxY = -Infinity
let minZ = Infinity
let maxZ = -Infinity

const gridArr = [...grid]
const total = gridArr.reduce((acc, point) => {
  const [x, y, z] = point.split(",").map(Number)

  minX = Math.min(minX, x)
  maxX = Math.max(maxX, x)
  minY = Math.min(minY, y)
  maxY = Math.max(maxY, y)
  minZ = Math.min(minZ, z)
  maxZ = Math.max(maxZ, z)

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
minX--
maxX++
minY--
maxY++
minZ--
maxZ++

const queue = [
  {
    x: minX,
    y: minY,
    z: minZ,
  },
]
const outsideSet = new Set<string>()
while (queue.length) {
  const item = queue.shift()

  if (!item) continue
  const { x, y, z } = item

  const neighbors = getNeighbors(x, y, z)
  neighbors.forEach(([i, j, k]) => {
    const newPoint = pointToKey(i, j, k)

    if (i < minX || i > maxX) return
    if (j < minY || j > maxY) return
    if (k < minZ || k > maxZ) return
    if (grid.has(newPoint) || outsideSet.has(newPoint)) return

    outsideSet.add(newPoint)
    queue.push({ x: i, y: j, z: k })
  })
}

let pocketArr = [...pocketSet]
pocketArr.forEach((point) => {
  if (outsideSet.has(point)) {
    pocketSet.delete(point)
  }
})

pocketArr = [...pocketSet]
const pocketArea = pocketArr.reduce((acc, point) => {
  const [x, y, z] = keyToPoint(point)
  const neighbors = getNeighbors(x, y, z)

  let area = 0
  neighbors.forEach(([i, j, k]) => {
    const newPoint = pointToKey(i, j, k)
    if (grid.has(newPoint)) {
      area++
    }
  })

  return acc + area
}, 0)

logP2(total - pocketArea)
