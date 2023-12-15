import fs from "fs";

const lcm = (vals) => {
  let counterInc = vals.reduce((min, curr) =>
    curr < min || !min ? curr : min
  );
  let counter = counterInc;
  while (!vals.every((v) => counter % v === 0)) {
    counter += counterInc;
  }
  return counter;
};

fs.readFile("input.txt", "utf-8", (_, f) => {
  const [instr, network] = f.split("\n\n");

  const nodes = network.split("\n").map((n) => {
    const chars = [...n];
    const parseIdentifier = (start, count) =>
      chars.filter((_, i) => i >= start && i < start + count).join("");
    const root = parseIdentifier(0, 3);
    const [left, right] = [parseIdentifier(7, 3), parseIdentifier(12, 3)];
    return { root, left, right };
  });

  const executeGraph = (terminalValueFn, initVal) => {
    let terminateLoop = false;
    let totalCount = 0;
    let root = initVal;
    while (!terminateLoop) {
      const { terminate, count, currentNode } = [...instr.trim()].reduce(
        ({ count, currentNode, terminate }, curr) => {
          if (terminate || terminalValueFn(currentNode)) {
            return { terminate: true, count };
          }
          const node = nodes.find((n) => currentNode === n.root);
          return {
            count: count + 1,
            currentNode: curr === "L" ? node.left : node.right,
          };
        },
        { count: 0, currentNode: root }
      );
      terminateLoop = terminate;
      totalCount += count;
      root = currentNode;
    }
    return totalCount;
  };

  const partA = executeGraph((a) => a === "ZZZ", "AAA");
  const partB = lcm(
    nodes
      .filter((a) => [...a.root][2] === "A")
      .map((a) => executeGraph((b) => [...b][2] === "Z", a.root))
  );
  console.log(`Part A : ${partA}`);
  console.log(`Part B : ${partB}`);
});
