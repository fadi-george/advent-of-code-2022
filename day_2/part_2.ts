import { readInput } from "../helpers";

const input = readInput();

enum RoundType {
  Lose = "X",
  Draw = "Y",
  Win = "Z",
}

const shapeScore = [1, 2, 3];
enum ShapeIndex {
  A = 0,
  B = 1,
  C = 2,
}

enum RoundScore {
  Lose = 0,
  Draw = 3,
  Win = 6,
}

const total = input.reduce((total, line) => {
  const [opponent, roundType] = line.split(" ");
  const index = ShapeIndex[opponent];

  let score = 0;
  if (roundType === RoundType.Draw) {
    score = shapeScore[index] + RoundScore.Draw;
  } else if (roundType === RoundType.Lose) {
    score = shapeScore[(index + 2) % 3] + RoundScore.Lose;
  } else {
    score = shapeScore[(index + 1) % 3] + RoundScore.Win;
  }

  return total + score;
}, 0);

console.log("Total: ", total);
