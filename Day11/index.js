import fs from "fs";

fs.readFile("./input.txt", "utf-8", (_, data) => {
  const partB = false;
  const expansionFactor = 1000000;
  const lines = data.split("\n");
  const rowWidth = lines[0].length;
  const colMap = new Array(rowWidth).fill(false);
  const { emptyRows, columnPositions } = lines.reduce(
    (prev, current, yIndex) => {
      const galaxySearch = [...current]
        .map((x, index) => (x === "#" ? index : -1))
        .filter((x) => x >= 0);
      if (galaxySearch.length === 0) {
        prev.emptyRows.push(yIndex);
      } else {
        for (let i = 0; i < galaxySearch.length; i++) {
          prev.columnPositions[galaxySearch[i]] = true;
        }
      }
      return prev;
    },
    { columnPositions: colMap, emptyRows: [] }
  );
  const missingColumns = columnPositions
    .map((x, index) => ({ x, index }))
    .filter(({ x }) => !x)
    .map(({ index }) => index);

  const getExpandedPoint = ({ x, y }) => {
    const xDisplacement =
      missingColumns.reduce((prev, curr) => (curr < x ? prev + 1 : prev), 0) *
      (partB ? expansionFactor - 1 : 1);
    const yDisplacement =
      emptyRows.reduce((prev, curr) => (curr < y ? prev + 1 : prev), 0) *
      (partB ? expansionFactor - 1 : 1);
    return { x: x + xDisplacement, y: y + yDisplacement };
  };
  const galaxies = lines
    .reduce(
      (prev, current, y) =>
        prev.concat(
          [...current]
            .map((c, x) => ({ x, y, val: c }))
            .filter((a) => a.val === "#")
            .map(({ x, y }) => getExpandedPoint({ x, y }))
        ),
      []
    )
    .map(({ x, y }, index) => ({ x, y, index }));
  const pairs = galaxies.reduce(
    (prev, curr, index, gs) =>
      prev.concat(
        gs.slice(index + 1).reduce((p, c) => {
          p.push([curr, c]);
          return p;
        }, [])
      ),
    []
  );

  const total = pairs.reduce((prev, [fst, snd]) => {
    const xD = Math.abs(fst.x - snd.x);
    const yD = Math.abs(fst.y - snd.y);
    return prev + xD + yD;
  }, 0);
  console.log(pairs.length);
  console.log(total);
});
