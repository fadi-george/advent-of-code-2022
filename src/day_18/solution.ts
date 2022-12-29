import { keyToPoint, pointToKey, printObject, readInput } from "../helpers"

const input = readInput(false)
const grid = new Set<string>()

input.forEach((line) => {
  grid.add(line)
})

const intersections: Record<string, number> = {}
const getNeighbors = (x: number, y: number, z: number) => [
  [x - 1, y, z], // left
  [x + 1, y, z], // right
  [x, y - 1, z], // top
  [x, y + 1, z], // bottom
  [x, y, z - 1], // front
  [x, y, z + 1], // back
]

const gridArr = [...grid]
const total = gridArr.reduce((acc, point) => {
  const [x, y, z] = point.split(",").map(Number)

  let surfaceArea = 6

  const neighbors = getNeighbors(x, y, z)
  neighbors.forEach(([i, j, k]) => {
    const newPoint = pointToKey(i, j, k)
    intersections[newPoint] = 1

    if (grid.has(newPoint)) {
      surfaceArea--
    }
  })

  return acc + surfaceArea
}, 0)

// Part 1
logP1(total)

// Part 2
const neighborsSet = new Set<string>()

// count intersections
gridArr.forEach((point) => {
  let minX: number | undefined
  let maxX: number | undefined
  let minY: number | undefined
  let maxY: number | undefined
  let minZ: number | undefined
  let maxZ: number | undefined
  const [x, y, z] = keyToPoint(point)
  gridArr.forEach((point2) => {
    if (point === point2) return
    const [x2, y2, z2] = keyToPoint(point2)
    const diffX = x2 - x
    const diffY = y2 - y
    const diffZ = z2 - z
    if (diffX && diffY === 0 && diffZ === 0) {
      if (diffX < 0) minX = Math.max(minX || -Infinity, diffX)
      else maxX = Math.min(maxX || Infinity, diffX)
    } else if (diffY && diffX === 0 && diffZ === 0) {
      if (diffY < 0) minY = Math.max(minY || -Infinity, diffY)
      else maxY = Math.min(maxY || Infinity, diffY)
    } else if (diffZ && diffX === 0 && diffY === 0) {
      if (diffZ < 0) minZ = Math.max(minZ || -Infinity, diffZ)
      else maxZ = Math.min(maxZ || Infinity, diffZ)
    }
  })
  // printObject({ minX, maxX, minY, maxY, minZ, maxZ, point })

  if (maxX) {
    for (let i = 1; i < maxX; i++) {
      const pointKey = pointToKey(x + i, y, z)
      if (!neighborsSet.has(pointKey)) {
        neighborsSet.add(pointKey)
      } else {
        intersections[pointKey] = (intersections[pointKey] || 0) + 1
      }
    }
  }
  if (minX) {
    for (let i = -1; i > minX; i--) {
      const pointKey = pointToKey(x + i, y, z)
      if (!neighborsSet.has(pointKey)) {
        neighborsSet.add(pointKey)
      } else {
        intersections[pointKey] = (intersections[pointKey] || 0) + 1
      }
    }
  }
  if (maxY) {
    for (let i = 1; i < maxY; i++) {
      const pointKey = pointToKey(x, y + i, z)
      if (!neighborsSet.has(pointKey)) {
        neighborsSet.add(pointKey)
      } else {
        intersections[pointKey] = (intersections[pointKey] || 0) + 1
      }
    }
  }
  if (minY) {
    for (let i = -1; i > minY; i--) {
      const pointKey = pointToKey(x, y + i, z)
      if (!neighborsSet.has(pointKey)) {
        neighborsSet.add(pointKey)
      } else {
        intersections[pointKey] = (intersections[pointKey] || 0) + 1
      }
    }
  }
  if (maxZ) {
    for (let i = 1; i < maxZ; i++) {
      const pointKey = pointToKey(x, y, z + i)
      if (!neighborsSet.has(pointKey)) {
        neighborsSet.add(pointKey)
      } else {
        intersections[pointKey] = (intersections[pointKey] || 0) + 1
      }
    }
  }
  if (minZ) {
    for (let i = -1; i > minZ; i--) {
      const pointKey = pointToKey(x, y, z + i)
      if (!neighborsSet.has(pointKey)) {
        neighborsSet.add(pointKey)
      } else {
        intersections[pointKey] = (intersections[pointKey] || 0) + 1
      }
    }
  }
})

const pocketArea = Object.entries(intersections).reduce(
  (acc, [point, count]) => {
    if (count === 6) {
      const [x, y, z] = keyToPoint(point)
      let area = 0

      getNeighbors(x, y, z).forEach(([i, j, k]) => {
        const newPoint = pointToKey(i, j, k)
        if (grid.has(newPoint)) {
          area++
        }
      })

      return acc + area
    }

    return acc
  },
  0
)

console.log(
  Object.entries(intersections)
    .sort((p1, p2) => {
      const [x1, y1, z1] = keyToPoint(p1[0])
      const [x2, y2, z2] = keyToPoint(p2[0])

      return x1 - x2 || y1 - y2 || z1 - z2
    })
    .filter(([point, count]) => count === 5)
)
logP2(total - pocketArea)

// 4010 too high
// 2451 too low
