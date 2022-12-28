// @ts-ignore
global.logP1 = (...args: any[]) => console.log("Part 1 ⭐️  :", ...args)
// @ts-ignore
global.logP2 = (...args: any[]) => console.log("Part 2 ⭐️⭐️:", ...args)

export const clearScreen = () => console.log("\x1Bc")

export const logIf = (condition: boolean, ...args: any[]) => {
  if (condition) {
    console.log(...args)
  }
}

export const printGrid = ({ grid }: { grid: string[][] }) => {
  grid.forEach((row) => {
    console.log(row.join(""))
  })

  console.log("\n")
}

export const printObject = (obj: Record<string, unknown>) =>
  console.log(JSON.stringify(obj, null, 2))
