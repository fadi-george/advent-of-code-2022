import fs from "fs";

export const readInput = (useSample: boolean = false) => {
  const path = useSample ? "./sample.txt" : "./input.txt";
  return fs.readFileSync(path, "utf8").split("\n");
};
