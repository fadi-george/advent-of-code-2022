import { readInput } from "../helpers"

const input = readInput(true)

const fileSystem: Record<string, any> = {}
let paths: string[] = []
let subTree = fileSystem

input.forEach((op) => {
  const matchCD = op.match(/\$ cd (.*)/)
  const dir = op.match(/dir (.*)/)
  const file = op.match(/^(\d*) (.*)/)

  if (matchCD) {
    subTree = fileSystem
    const nextPath = matchCD[1]

    if (matchCD[1] === "..") {
      paths.pop()
    } else {
      paths.push(nextPath)
    }

    paths.forEach((subPath, index) => {
      if (!subTree[subPath]) subTree[subPath] = {}
      subTree = subTree[subPath]
    })
  } else if (dir) {
    const currDir = dir[1]
    if (!subTree[currDir]) subTree[currDir] = {}
  } else if (file) {
    subTree[file[2]] = Number(file[1])
  }
})

let maxSize = 100000
let dirSizes: Record<string, number> = {}

const traverse = (tree: Record<string, any>, parent: string) => {
  return Object.keys(tree).reduce((acc, key) => {
    let size = 0
    if (typeof tree[key] === "number") {
      size = tree[key]
    } else {
      let pathKey = parent + key
      if (parent !== "/" && parent) pathKey = parent + "/" + key

      if (!dirSizes[pathKey]) {
        dirSizes[pathKey] = traverse(tree[key], pathKey)
      }
      size = dirSizes[pathKey]
    }

    return acc + size
  }, 0)
}
traverse(fileSystem, "")

let totalSize = 0
Object.keys(dirSizes).forEach((key) => {
  if (dirSizes[key] <= maxSize) {
    totalSize += dirSizes[key]
  }
})

logP1(totalSize)
