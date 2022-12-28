import fs from "fs";
import path from "path";

export const isNumber = (value: any): value is number =>
  typeof value === "number";

export const readInput = (useSample: boolean = false, regex: string = "\n") => {
  const textPath = useSample ? "sample.txt" : "input.txt";
  return fs.readFileSync(path.join(textPath), "utf8").split(regex);
};

export const pointToKey = (x: number, y: number) => `${x},${y}`;

export const keyToPoint = (str: string) => str.split(",").map(Number);

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const split2Pairs = (arr: any[]) =>
  arr.reduce((acc, _, index, array) => {
    if (index % 2 === 0) acc.push(array.slice(index, index + 2));
    return acc;
  }, []);

export const logIf = (condition: boolean, ...args: any[]) => {
  if (condition) {
    console.log(...args);
  }
};

export const printGrid = ({ grid }: { grid: string[][] }) => {
  grid.forEach((row) => {
    console.log(row.join(""));
  });

  console.log("\n");
};

export const printObject = (obj: Record<string, unknown>) =>
  console.log(JSON.stringify(obj, null, 2));

export const clearScreen = () => {
  console.log("\x1Bc");
};

export const partition = (arr: unknown[], size: number) => {
  const result: unknown[] = [];
  let temp: unknown[] = [];

  for (let a = 0; a < arr.length; a++) {
    temp.push(arr[a]);
    if (a % size === size - 1) {
      result.push(temp);
      temp = [];
    }
  }

  if (temp.length > 0) result.push(temp);

  return result;
};

export const permutate = (inputArr: unknown[]) => {
  let result: unknown[] = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };

  permute(inputArr);

  return result;
};
