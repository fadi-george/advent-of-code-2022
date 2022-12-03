import fs from "fs";

export const readInput = ({ useSample = false }: { useSample: boolean }) => {
  const path = useSample ? "./sample.txt" : "./input.txt";
  return fs.readFileSync(path, "utf8").split("\n");
};
