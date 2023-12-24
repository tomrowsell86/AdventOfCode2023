import fs from "fs";

fs.readFile("input.txt", "utf-8", (_, f) => {
  const graph = f.split("\n").map((l, yAxis) =>
    [...l].map((c, xAxis) => {
      return { x: xAxis, y: yAxis, content: c };
    })
  );

  const translate = ([x, y], [dx, dy]) => [x + dx, y + dy];
  const connects = (target, source) => {
    const [xDelta, yDelta] = [target.x - source.x, target.y - source.y];

    const dir = xDelta < 0 ? "W" : xDelta > 0 ? "E" : yDelta < 0 ? "N" : "S";

    const southConnectParts = ["L", "J", "|"];
    const northConnectParts = ["7", "F", "|"];
    const westConnectParts = ["F", "L", "-"];
    const eastConnectParts = ["J", "7", "-"];

    switch (dir) {
      case "N":
        return northConnectParts.includes(target.content);
      case "S":
        return southConnectParts.includes(target.content);
      case "E":
        return eastConnectParts.includes(target.content);
      case "W":
        return westConnectParts.includes(target.content);
      default:
        throw "direction not recognised";
    }
  };
  const follow = ({ x, y, content }, graph, prev) => {
    const getOptions = (content) => {
      switch (content) {
        case "S":
          return [
            [0, 1],
            [1, 0],
            [-1, 0],
            [0, -1],
          ];
        case "|":
          return [
            [0, 1],
            [0, -1],
          ];

        case "-":
          return [
            [1, 0],
            [-1, 0],
          ];
        case "L":
          return [
            [0, -1],
            [1, 0],
          ];
        case "J":
          return [
            [0, -1],
            [-1, 0],
          ];
        case "7":
          return [
            [0, 1],
            [-1, 0],
          ];
        case "F":
          return [
            [0, 1],
            [1, 0],
          ];
        default:
          return [];
      }
    };
    //get connected pipe parts
    const options = getOptions(content).map(([dx, dy]) =>
      translate([x, y], [dx, dy])
    );
    const output = options
      .filter(([x, y]) => !(x < 0 || y < 0))
      .map(([x, y]) => graph[y][x])
      .filter(
        (i) =>
          connects(i, { x, y, content }) &&
          (!prev || !(i.x === prev.x && i.y === prev.y))
      );
    return output.length > 0 ? output.shift() : undefined;
  };
  const startPoint = graph
    .find((a) => a.findIndex((b) => b.content === "S") !== -1)
    .find((a) => a.content === "S");

  let next = follow(startPoint, graph, undefined);
  const pipeParts = [startPoint, next];
  let i = 1;
  let prev = startPoint;
  while (next) {
    const newValue = follow(next, graph, prev);
    prev = next;
    next = newValue;
    if (next) {
      pipeParts.push(next);
    }
    i++;
  }
  console.log(Math.ceil(i / 2))
  console.log(pipeParts);
  //part B filter grid to get any non loop tiles that are adjacent to main loop.
  // starting at a corner determine an inner loop
});
