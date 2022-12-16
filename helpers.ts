import fs from "fs";
import path from "path";

export const readInput = (useSample: boolean = false, regex: string = "\n") => {
  const textPath = useSample ? "sample.txt" : "input.txt";
  return fs.readFileSync(path.join(textPath), "utf8").split(regex);
};

export const isNumber = (value: any): value is number =>
  typeof value === "number";

export const pointToKey = (x: number, y: number) => `${x},${y}`;

export const keyToPoint = (str: string) => str.split(",").map(Number);

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const split2Pairs = (arr: any[]) =>
  arr.reduce((acc, _, index, array) => {
    if (index % 2 === 0) acc.push(array.slice(index, index + 2));
    return acc;
  }, []);
