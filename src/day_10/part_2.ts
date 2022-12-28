import { readInput } from "../helpers"

const input = readInput().map((line) => line.split(" "))

let spritePositions = "###....................................."
let crtRow = ""
let imgIndex = 0

const width = 40
const drawImage = () => {
  if (spritePositions[imgIndex] === "#") crtRow += "#"
  else crtRow += "."
  imgIndex++

  if (imgIndex >= width) {
    console.log(crtRow)
    crtRow = ""
    imgIndex = 0
  }
}

const getSpritePositions = () => {
  let positions = ""
  if (x >= -1 && x <= width) {
    positions += "#"
    if (x > 0) positions += "#"
    if (x < width - 1) positions += "#"
  }
  positions = positions.padStart(x + 2, ".")
  positions = positions.padEnd(width, ".")
  return positions
}

console.log("Part 2:")
let x = 1
input.forEach((line) => {
  let op = line[0]

  switch (op) {
    case "noop": {
      drawImage()
      break
    }
    case "addx": {
      let amt = Number(line[1])
      drawImage()
      drawImage()

      spritePositions = ""

      x += amt
      spritePositions = getSpritePositions()
      break
    }
  }
})
