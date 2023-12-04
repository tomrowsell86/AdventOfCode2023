import fs from "fs";

fs.readFile("input.txt", "utf-8", (_, f) => {
  const numberMap = new Map([
    ["zero", 0],
    ["one", 1],
    ["two", 2],
    ["three", 3],
    ["four", 4],
    ["five", 5],
    ["six", 6],
    ["seven", 7],
    ["eight", 8],
    ["nine", 9],
  ]);

  const numberIndexes = (l) =>
    l
      .split("")
      .map((c, i) => {
        return { value: Number.parseInt(c, 10), position: i };
      })
      .filter((n) => !Number.isNaN(n.value));
  // const partA = f
  //   .split("\n")
  //   .map((l) =>
  //     numberIndexes(l)
  //       .filter((_, i, { length }) => i === 0 || i === length - 1)
  //       .reduce(
  //         (s, curr, i, { length }) =>
  //           s +
  //           (length < 2 ? curr.value : 0) +
  //           (i === 0 ? curr.value * 10 : curr.value),
  //         0
  //       )
  //   )
  //   .map((c) => {
  //     return c;
  //   })
  //   .reduce((t, c) => t + c, 0);
  // console.log(`Part A ${partA}`);

  const partB = f
    .split("\n")
    .map((l) => {
      const numbers = numberIndexes(l);
      console.log(numbers);
      return Array.from(numberMap.keys())
        .map((n) => {
          return {
            value: numberMap.get(n),
            position: l.indexOf(n,0),
          };
        })
        .filter(({ position }) => position >= 0)
        .concat(numbers)
        .sort((a, b) =>
          a.position < b.position ? -1 : a.position > b.position ? 1 : 0
        )
        .reduce(
          (total, curr, i, { length }) =>
            (i === 0 ? curr.value * 10 : i === length - 1 ? curr.value : 0) +
            (length === 1 ? curr.value : 0) +
            total
        ,0);
    })
    .reduce((total, c) => total + c, 0);

  console.log(partB);
});