export const pointToKey = (x: number, y: number) => `${x},${y}`
export const keyToPoint = (str: string) => str.split(",").map(Number)
