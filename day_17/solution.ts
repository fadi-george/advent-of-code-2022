import { printGrid, readInput } from "../helpers"

const useSample = true

type Position = { row: number; col: number }

const width = 7
let grid: string[][] = []
let position = { row: 0, col: 0 }
const gusts = readInput(useSample, "")
const rocks = [
  [["#", "#", "#", "#"]],
  [
    [".", "#", "."],
    ["#", "#", "#"],
    [".", "#", "."],
  ],
  [
    [".", ".", "#"],
    [".", ".", "#"],
    ["#", "#", "#"],
  ],
  [["#"], ["#"], ["#"], ["#"]],
  [
    ["#", "#"],
    ["#", "#"],
  ],
]

const drawRock = ({ rock, ch }: { rock: string[][]; ch: string }) => {
  const rockLength = rock.length - 1
  const { row, col } = position

  rock.forEach((r, i) => {
    r.forEach((c, j) => {
      if (grid[row + i - rockLength][col + j] !== "#")
        grid[row + i - rockLength][col + j] = c === "." ? "." : ch
    })
  })
}

const isValidIntersection = ({
  position: { row, col },
  rock,
}: {
  position: Position
  rock: string[][]
}) => {
  const w = rock[0].length
  const h = rock.length

  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const ch = grid[row - r][col + c]
      const rCh = rock[h - r - 1][c]

      if (ch !== "." && rCh !== "." && ch !== "@") return false
    }
  }

  return true
}

const moveRock = ({
  rock,
  diff: { row, col },
}: {
  rock: string[][]
  diff: { row: number; col: number }
}) => {
  drawRock({ rock, ch: "." })
  position.row += row
  position.col += col
  drawRock({ rock, ch: "@" })
}

const shiftRock = ({ rock, gust }: { rock: string[][]; gust: string }) => {
  const { col } = position

  if (gust === ">") {
    if (col + rock[0].length <= width - 1) {
      const valid = isValidIntersection({
        position: {
          row: position.row,
          col: position.col + 1,
        },
        rock,
      })
      if (!valid) return
      return moveRock({ rock, diff: { row: 0, col: 1 } })
    }
  }
  if (gust === "<") {
    if (col >= 1) {
      const valid = isValidIntersection({
        position: {
          row: position.row,
          col: position.col - 1,
        },
        rock,
      })

      if (!valid) return
      return moveRock({ rock, diff: { row: 0, col: -1 } })
    }
  }
}

const fallDown = ({ rock }: { rock: string[][] }) => {
  if (position.row + 1 >= grid.length) return false

  const isValid = isValidIntersection({
    position: {
      row: position.row + 1,
      col: position.col,
    },
    rock,
  })
  if (!isValid) return false
  moveRock({ rock, diff: { row: 1, col: 0 } })
  return true
}

const getKey = (rockInd: number, gInd: number) => `${rockInd},${gInd}`

const periodStart = gusts.length

const run = (amount: number) => {
  const heightCache = {}
  grid = []
  position = { row: 0, col: 0 }

  let gInd = 0
  let periodInd = 0
  let highestRock = 0
  let towerHeight = 0
  let offset = 0

  for (let i = 0; i < amount; i++) {
    let oldLength = grid.length
    let rockInd = i % rocks.length
    let currRock = rocks[rockInd]

    const key = getKey(rockInd, gInd)
    if (heightCache[key]) {
      if (!periodInd) periodInd = i
      offset += heightCache[key].diff
      gInd = heightCache[key].gInd
      continue
    }

    const diff = 3 + currRock.length
    grid = [
      ...Array(diff)
        .fill("")
        .map(() => Array(7).fill(".")),
      ...grid,
    ]

    position.row = 0 + currRock.length - 1
    position.col = 2
    drawRock({ rock: currRock, ch: "@" })

    let falling = true
    let gustStartInd = gInd

    while (falling) {
      const currGust = gusts[gInd++]
      if (gInd >= gusts.length) gInd = 0

      shiftRock({ rock: currRock, gust: currGust })

      const valid = fallDown({ rock: currRock })

      if (!valid) {
        drawRock({ rock: currRock, ch: "#" })
        falling = false

        highestRock = grid.findIndex((row) => row.includes("#"))
        grid = grid.slice(highestRock)

        if (i > periodStart) {
          heightCache[getKey(rockInd, gustStartInd)] = {
            diff: grid.length - oldLength,
            gInd,
          }
        }
        towerHeight = grid.length
      }
    }
  }

  return {
    towerHeight: towerHeight + offset,
    periodInd,
    period: Object.keys(heightCache).length,
    periodHeight: Object.keys(heightCache).reduce(
      (acc, key) => acc + heightCache[key].diff,
      0
    ),
  }
}

const { periodInd, period, periodHeight } = run(periodStart * 2)

const run2 = (amount: number) => {
  if (periodInd > amount) return run(amount).towerHeight

  const { towerHeight: initialHeight } = run(periodInd)
  const newAmount = amount - periodInd

  const count = Math.floor(newAmount / period)
  const rem = newAmount % period

  const remHeight = run(periodInd + rem).towerHeight - initialHeight

  return initialHeight + count * periodHeight + remHeight
}

console.log("Part 1: ", run2(2022))
console.log("Part 2: ", run2(1000000000000))
