import fs from "fs"
import path from "path"

export * from "./dijkstra"
export * from "./grid"
export * from "./log"

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const isNumber = (value: any): value is number =>
  typeof value === "number"

export const readInput = (useSample: boolean = false, regex: string = "\n") => {
  const textPath = useSample ? "sample.txt" : "input.txt"
  return fs.readFileSync(path.join(textPath), "utf8").split(regex)
}

export const split2Pairs = (arr: any[]) =>
  arr.reduce((acc, _, index, array) => {
    if (index % 2 === 0) acc.push(array.slice(index, index + 2))
    return acc
  }, [])
