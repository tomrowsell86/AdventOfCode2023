import fs from "fs";

fs.readFile("input.txt", "utf-8", (_, file) => {
  const almanacBlocks = file.split("\n\n");
  const seeds = almanacBlocks[0]
    .split(":")[1]
    .split(" ")
    .map((i) => i.trim())
    .filter((i) => i.length > 0)
    .map((i) => Number.parseInt(i));
  const parseMap = (blockIndex) => {
    return almanacBlocks[blockIndex]
      .split(":\n")[1]
      .split("\n")
      .filter((a) => a.trim().length > 0)
      .map((a) =>
        a
          .split(" ")
          .filter((a) => a.trim().length > 0)
          .map((a) => Number.parseInt(a))
      )
      .map(([dest, source, range]) => {
        return { destTranslate: (s) => s + (dest - source), source, range };
      });
  };
  const soil = parseMap(1);
  const fertiliser = parseMap(2);
  const water = parseMap(3);
  const light = parseMap(4);
  const temp = parseMap(5);
  const hum = parseMap(6);
  const loc = parseMap(7);

  const mapLookup = (map, initVal) => {
    const matches = map.filter(
      (so) => initVal <= so.source + so.range && initVal >= so.source
    );
    return matches.length > 0 ? matches[0].destTranslate(initVal) : initVal;
  };
  const execCascade = (seed) =>
    [soil, fertiliser, water, light, temp, hum, loc].reduce((state, curr) => {
      return mapLookup(curr, state);
    }, seed);

  const mapCascade = (seeds) => {
    return seeds.reduce((lowestLocation, s) => {
      const locVal = execCascade(s);
      return locVal < lowestLocation ? locVal : lowestLocation;
    });
  };

  const partAResult = mapCascade(seeds);
  const pairedSeeds = seeds.reduce(
    ({ current, buffer }, s, i) => {
      return i > 0 && i % 2 != 0
        ? { buffer: [...buffer, [current, s]] }
        : { buffer, current: s };
    },
    { buffer: [] }
  );
  const partBResult = pairedSeeds.buffer.reduce((state, [initVal, range]) => {
    let currentValue = initVal;
    let lowestLocation 
    while (currentValue <= initVal + range) {
      const location = execCascade(currentValue)
      if(currentValue % 500000 === 0) {console.log(currentValue)} 
      if (!lowestLocation || location < lowestLocation){
        lowestLocation = location
      }
      currentValue++;
    }
    return !state || lowestLocation < state ? lowestLocation : state;
  }, 0);

  //[...Array(range).keys()].map(a => initVal + a + 1)).flat()


  console.log(partAResult);
  console.log(partBResult);
  //const partBResult =
});
