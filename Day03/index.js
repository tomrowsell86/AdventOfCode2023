import fs from "fs";

fs.readFile("input.txt", "ascii", (_, f) => {
  const buildValueFromParts = (numbers) => {
    return Number.parseInt(numbers.reduce((v, c) => v + c));
  };
  const adjLocations = [
    [-1, 0],
    [0, -1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
    [1, 0],
    [0, 1],
  ];
  const translate = ([x, y], [dx, dy]) => [x + dx, y + dy];
  const isPartNumber = ({ x, y, value }, partMarkers) => {
    const digitLength = value.toString().length;
    const xRange = [...Array(digitLength).keys()];
    const adjacentSymbols = xRange
      .map((a) => [x + a, y])
      .filter(
        ([nx, ny]) =>
          adjLocations
            .map(([dx, dy]) => translate([nx, ny], [dx, dy]))
            .filter(
              ([x2, y2]) =>
                partMarkers.findIndex((pm) => pm.x === x2 && pm.y === y2) !== -1
            ).length > 0
      );

    return adjacentSymbols.length > 0;
  };
  const partGrid = f.split("\n").map((l, y) =>
    l.split("").reduce(
      ({ numRefs, buffer, symbolRefs }, curr, x, { length }) => {
        const parsedValue = Number.parseInt(curr);
        if (Number.isNaN(parsedValue)) {
          const state = {
            buffer: [],
            numRefs:
              buffer.length > 0
                ? [
                    ...numRefs,
                    {
                      value: buildValueFromParts(buffer),
                      y: y,
                      x: x - buffer.length,
                    },
                  ]
                : numRefs,
            symbolRefs,
          };
          if (curr !== ".") {
            state.symbolRefs.push({ x: x, y: y, value: curr });
          }

          return state;
        }
        buffer.push(curr);
        if (length - 1 === x) {
          return {
            symbolRefs,
            buffer: [],
            numRefs: [
              ...numRefs,
              {
                x: x - buffer.length,
                y: y,
                value: buildValueFromParts(buffer),
              },
            ],
          };
        }
        return { numRefs, buffer, symbolRefs };
      },
      { buffer: [], numRefs: [], symbolRefs: [] }
    )
  );

  const numbers = partGrid.flatMap((a) => a.numRefs).flat();
  const symbols = partGrid.flatMap((a) => a.symbolRefs).flat();

  const partNumbers = numbers.filter((n) => isPartNumber(n, symbols));

  const getSymbolAdjacents = (symbol, numbers) => {
    const result = numbers.filter(({ x, y, value }) =>
      [...Array(value.toString().length).keys()]
        .map((ix) => [x + ix, y])
        .some(([x1, y1]) =>
          adjLocations
            .map(([dx, dy]) => [x1 + dx, y1 + dy])
            .some(([x2, y2]) => symbol.x === x2 && symbol.y === y2)
        )
    );
    console.log(result);
    return result;
  };

  const partA = partNumbers.reduce((s, c) => {
    return s + c.value;
  }, 0);

  const partB = symbols
    .filter((s) => s.value === "*")
    .map((s) => getSymbolAdjacents(s, numbers))
    .filter((c) => {
      console.log(c);
      return c.length === 2;
    })
    .map(([r1, r2]) => r1.value * r2.value)
    .reduce((t, c) => c + t, 0);
  console.log(partB);
  console.log(partA);
});
