import fs from "fs";
fs.readFile("input.txt", "utf-8", (_, f) => {
  const [time, distance] = f
    .split("\n")
    .map((a) => a.split(":")[1])
    .map((a) => a.split(" "))
    .map((a) =>
      a
        .filter((b) => b.trim().length > 0)
        .map((item) => {
          return Number.parseInt(item);
        })
    );

  const races = time.map((t, i) => {
    return { raceId: i, time: t, distance: distance[i] };
  });

  const partA = races.reduce((state, r) => {
    const distances = getDistances(r);

    console.log(distances);
    return state * distances.filter((d) => d > r.distance).length;
  }, 1);
  const { timeStr, distStr } = races.reduceRight(
    ({ timeStr, distStr }, { time, distance }) => {
      return {
        timeStr: time.toString() + timeStr,
        distStr: distance.toString() + distStr,
      };
    },
    { timeStr: "", distStr: "" }
  );
  const timeB = Number.parseInt(timeStr) 
  const distanceB = Number.parseInt(distStr) 
  const dist =  getDistances({time: timeB, distance:distanceB})
  console.log(dist)
  console.log(dist.filter((d) => d > distanceB).length);

  console.log(partA);
});
function getDistances(r) {
    return [...Array(r.time - 1).keys()]
        .filter((_, i) => i > 0)
        .map((a) => a * (r.time - a));
}

