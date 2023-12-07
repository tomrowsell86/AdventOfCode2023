import fs from "fs";
fs.readFile("input.txt", "utf-8", (_, f) => {
  const games = f
    .split("\n")
    .map((l) => l.split(":"))
    .map(([idPart, num]) => {
      const [actualSet, winningSet] = num.split("|").map((w) =>
        w
          .split(" ")
          .filter((a) => a.trim().length > 0)
          .map((n) => Number.parseInt(n))
      );
      return {
        actualSet,
        winningSet,
        cardId: Number.parseInt(idPart.split(" ").filter(a => a.trim().length > 0)[1]),
      };
    });
  const winningActuals = (card) =>
    card.winningSet.filter(
      (w) => card.actualSet.findIndex((a) => a === w) !== -1
    );
  const partA = games.reduce((points, curr) => {
    return (
      points +
      winningActuals(curr)
        .map((_, i) => Math.pow(2, i))
        .reduce((t, c) => (c > t ? c : t), 0)
    );
  }, 0);

  const partB = games.reduce((cardCount, curr, i, arr) => {
    const innerRec = (card) => {
      const wa = winningActuals(card);
      let copiedCards = [...Array(wa.length).keys()]
        .map((k) => card.cardId + 1 + k)
        .map((k) => arr.find((c) => c.cardId === k))
        .filter((k) => k);
      return copiedCards.length + copiedCards
        .map((cc) => innerRec(cc))
        .reduce((t, c) => c + t, 0);
    };
    return cardCount + innerRec(curr);
  }, games.length);
  console.log(partA);
  console.log(partB);
});
