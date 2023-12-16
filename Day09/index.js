import fs from "fs";

fs.readFile("input.txt", "utf-8", (_, f) => {
  const recurseDiff = (vals, depth, graph) => {
    const { newDiffs } = vals.reduce(({ newDiffs, prev }, curr) => {
      return { newDiffs: prev === undefined ? newDiffs : [...newDiffs, curr - prev], prev: curr };
    }, {newDiffs:[]});
    return !newDiffs.every((d) => d === 0)
      ? recurseDiff(newDiffs, ++depth, [...graph, vals])
      : { graph: [...graph, vals], depth };
  };

  const executeExtrapolation = partB => f.split("\n").reduce((extrValSum, curr) => {
    const startingSeq = curr.split(" ").map(a => Number.parseInt(a));
    const { graph, depth } = recurseDiff(startingSeq, 0, []);
    let depthRange = depth;
    let [currentDelta] = graph[depthRange];
    while (depthRange != 0) {
        depthRange--
       const [last] = !partB ? graph[depthRange].reverse() : graph[depthRange]
       currentDelta = partB ? last - currentDelta : last + currentDelta
    }
    return extrValSum += currentDelta;
  },0);
  const partA = executeExtrapolation()
  const partB = executeExtrapolation(true)
  console.log(partA)
  console.log(partB)
});
