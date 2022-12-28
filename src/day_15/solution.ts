import { keyToPoint, pointToKey, readInput } from "../helpers"

const useSample = false
const input = readInput(useSample, "\n")

const grid = new Map<string, string>()

let row = useSample ? 10 : 2000000
const sensors: [number, number, number][] = []

const maxPos = 4000000

let maxX = -Infinity
let maxY = -Infinity

const checkRow = (row: number, x: number, y: number, dist: number) => {
  let check = false

  const top = [x, y - dist]
  const bottom = [x, y + dist]
  if (row <= bottom[1]) {
    if (row > y) {
      check = true
    } else if (row >= top[1]) {
      check = true
    }
  }

  if (check) {
    const yDiff = Math.abs(row - y)
    const xDiff = Math.abs(dist - yDiff)

    for (let i = -xDiff; i <= xDiff; i++) {
      const point = pointToKey(x + i, row)
      if (!grid.has(point)) {
        grid.set(pointToKey(x + i, row), "#")
      }
    }
  }
}

input.forEach((path) => {
  const inputs = path.match(/(-?\d+)/g)?.map(Number)

  if (inputs) {
    const [x1, y1, x2, y2] = inputs

    if (x1 > maxX) maxX = x1
    if (y1 > maxY) maxY = y1

    pointToKey(x1, y1)
    grid.set(pointToKey(x1, y1), "S")
    grid.set(pointToKey(x2, y2), "B")

    const dist = Math.abs(x1 - x2) + Math.abs(y1 - y2)
    sensors.push([x1, y1, dist])

    checkRow(row, x1, y1, dist)
  }
})

// part 1
let count = 0
;[...grid.entries()].forEach(([key, value]) => {
  const [x, y] = keyToPoint(key)
  if (y === row) {
    if (value === "#") count++
  }
})
logP1(count)

// part 2
maxX = Math.min(maxX, maxPos)
maxY = Math.min(maxY, maxPos)

const ranges: number[][][] = []
sensors.forEach(([x, y, dist]) => {
  for (let i = y - dist; i <= y + dist; i++) {
    const xDiff = Math.abs(dist - Math.abs(i - y))

    if (i >= 0 && i <= maxY) {
      let range = [x - xDiff, x + xDiff]

      if (range[0] < 0) range[0] = 0
      if (range[1] < 0) range[1] = maxX
      if (range[0] > maxX) range[0] = maxX
      if (range[1] > maxX) range[1] = maxX

      if (!ranges[i]) ranges[i] = []
      ranges[i].push(range)
    }
  }
})

ranges.forEach((currRanges, y) => {
  currRanges.sort((a, b) => a[0] - b[0])

  let newRanges: number[][] = []
  let tempRange = currRanges[0]

  for (let i = 1; i < currRanges.length; i++) {
    const [x1, x2] = tempRange
    const [x3, x4] = currRanges[i]

    if (x1 <= x3 && x3 <= x2) {
      const endX = x4 > x2 ? x4 : x2
      tempRange = [x1, endX]
    } else if (x3 < x1 && x4 >= x2) {
      const minX = x3
      const endX = x4 > x2 ? x4 : x2
      tempRange = [minX, endX]
    } else {
      newRanges.push(tempRange)
      tempRange = currRanges[i]
    }
  }

  newRanges.push(tempRange)
  ranges[y] = newRanges
})

let x = 0
let y = 0
for (const [row, currRanges] of ranges.entries()) {
  y = +row
  x = 0
  for (const [x1, x2] of currRanges) {
    if (x1 <= x && x <= x2) {
      x = x2 + 1

      if (x > maxX) {
        x = -1
        break
      }
    }
  }

  if (x >= 0 && x <= maxX) {
    break
  }
}
logP2(x * 4000000 + y)
