import fs from "fs";
fs.readFile("input.txt", "utf-8", (_, f) => {
  const partA = f
    .split("\n")
    .map(parseGame)
    .reduce(
      (possibleGames, { id, rounds }) =>
        rounds.every(
          (r) =>
            (r.colour === "red" && r.quantity <= 12) ||
            (r.colour === "blue" && r.quantity <= 14) ||
            (r.colour === "green" && r.quantity <= 13)
        )
          ? possibleGames + id
          : possibleGames,
      0
    );
  console.log(partA);

  const partB = f
    .split("\n")
    .map(parseGame)
    .reduce((total, { rounds }) => {
      const { maxR, maxG, maxB } = rounds.reduce(
        ({ maxR, maxG, maxB }, current) => {
          if (current.colour === "red" && current.quantity > maxR) {
            return { maxR: current.quantity, maxB, maxG };
          }
          if (current.colour === "blue" && current.quantity > maxB) {
            return { maxR, maxB: current.quantity, maxG };
          }
          if (current.colour === "green" && current.quantity > maxG) {
            return { maxR, maxB, maxG: current.quantity };
          }
          return {maxR,maxB,maxG}
        },
        { maxR: 0, maxB: 0, maxG: 0 }
      );
      console.log(maxB + ' ' + maxR + ' ' + maxG)
      return total + (maxB * maxG * maxR);
    },0);

  console.log(partB);
});

const parseGame = (l) => {
  const [idPart, remainder] = l.split(":");
  const [_, id] = idPart.split(" ");
  const rounds = remainder
    .split(";")
    .map((r) => r.trim().split(","))
    .map((ccs) =>
      ccs.map((cc) => {
        const [q, c] = cc.trim().split(" ");
        return { quantity: Number.parseInt(q), colour: c };
      })
    )
    .flat();

  return { rounds, id: Number.parseInt(id) };
};
