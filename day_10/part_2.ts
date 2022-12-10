import { readInput } from "../helpers";

const input = readInput().map((line) => line.split(" "));

let positions = [...Array(40)].map(() => ".");
let spritePositions = positions.slice(0);
spritePositions[0] = "#";
spritePositions[1] = "#";
spritePositions[2] = "#";

let crtRow = "";
let imgIndex = 0;

const drawImage = () => {
  if (spritePositions[imgIndex] === "#") crtRow += "#";
  else crtRow += ".";
  imgIndex++;

  if (imgIndex >= spritePositions.length) {
    console.log(crtRow);
    crtRow = "";
    imgIndex = 0;
  }
};

let x = 1;
input.forEach((line) => {
  let op = line[0];

  switch (op) {
    case "noop": {
      drawImage();
      break;
    }
    case "addx": {
      let amt = Number(line[1]);
      drawImage();
      drawImage();

      spritePositions = positions.slice();
      x += amt;
      if (x > 0) {
        spritePositions[x] = "#";
        if (x < positions.length - 1) spritePositions[x + 1] = "#";
        if (x > 0) spritePositions[x - 1] = "#";
      }
      break;
    }
  }
});
