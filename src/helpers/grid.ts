export const pointToKey = (...args: number[]) => args.join(",")
export const keyToPoint = (str: string) => str.split(",").map(Number)
