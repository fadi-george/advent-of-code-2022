import fs from "fs";

export const readInput = (useSample: boolean = false, regex?: string) => {
  const path = useSample ? "./sample.txt" : "./input.txt";
  return fs.readFileSync(path, "utf8").split(regex);
};
