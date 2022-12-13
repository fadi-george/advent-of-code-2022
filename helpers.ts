import fs from "fs";

export const readInput = (useSample: boolean = false, regex: string = "\n") => {
  const path = useSample ? "./sample.txt" : "./input.txt";
  return fs.readFileSync(path, "utf8").split(regex);
};

export const isNumber = (value: any): value is number =>
  typeof value === "number";
