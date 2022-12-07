// console.time("Part 2");
import { readInput } from "../helpers";

const input = readInput();

const total = input.reduce((acc, _, index) => {
  if ((index + 1) % 3 === 0) {
    const firstCharsSet = new Set(input[index - 2]);
    const secondCharsSet = new Set(input[index - 1]);
    const thirdCharsSet = new Set(input[index]);

    let commonLetters = new Set(
      [...firstCharsSet].filter((x) => secondCharsSet.has(x))
    );
    commonLetters = new Set(
      [...commonLetters].filter((x) => thirdCharsSet.has(x))
    );

    const priorities = [...commonLetters].map((letter) => {
      if (letter === letter.toLowerCase()) return letter.charCodeAt(0) - 96;
      return letter.charCodeAt(0) - 38;
    });

    return acc + priorities.reduce((a, b) => a + b, 0);
  }
  return acc;
}, 0);
// console.timeEnd("Part 2");
