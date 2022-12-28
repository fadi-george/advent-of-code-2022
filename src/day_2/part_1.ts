import { readInput } from "../helpers"

const input = readInput()

enum OpponentShape {
  Rock = "A",
  Paper = "B",
  Scissors = "C",
}

enum MyShape {
  Rock = "X",
  Paper = "Y",
  Scissors = "Z",
}

enum ShapeScore {
  X = 1,
  Y = 2,
  Z = 3,
}

enum RoundScore {
  Lose = 0,
  Draw = 3,
  Win = 6,
}

const total = input.reduce((total, line) => {
  const [opponent, you] = line.split(" ")
  let score = 0

  if (
    (opponent === OpponentShape.Rock && you === MyShape.Rock) ||
    (opponent === OpponentShape.Paper && you === MyShape.Paper) ||
    (opponent === OpponentShape.Scissors && you === MyShape.Scissors)
  ) {
    score = RoundScore.Draw
  } else if (
    (opponent === OpponentShape.Rock && you === MyShape.Paper) ||
    (opponent === OpponentShape.Paper && you === MyShape.Scissors) ||
    (opponent === OpponentShape.Scissors && you === MyShape.Rock)
  ) {
    score = RoundScore.Win
  } else {
    score = RoundScore.Lose
  }

  return total + ShapeScore[you] + score
}, 0)

logP1(total)
