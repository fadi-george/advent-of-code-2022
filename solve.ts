import fs from "fs"
import { Command } from "commander"
import child from "child_process"
import path from "path"

const program = new Command()

// const program = new Command()
program.option("-d, --day <day>").parse(process.argv)

const options = program.opts()
const day = options.day

process.chdir(`./src/day_${day}`)

// check for multiple files
if (fs.existsSync(`./solution.ts`)) {
  child.spawnSync("bun", ["./solution.ts"], { stdio: "inherit" })
} else {
  if (fs.existsSync(`./part_1.ts`))
    child.spawnSync("bun", ["./part_1.ts"], { stdio: "inherit" })

  if (fs.existsSync(`./part_2.ts`))
    child.spawnSync("bun", ["./part_2.ts"], { stdio: "inherit" })
}
