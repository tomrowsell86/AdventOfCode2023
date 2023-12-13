import fs from "fs";

fs.readFile("input.txt", "utf-8", (_, f) => {
  const cardRanksA = new Map(
    ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"].map(
      (v, i, { length }) => [v, length - i]
    )
  );
  const handComparison = (handA, handB, partB) => {
    return [...handA]
      .map((v, i) => {
        return {
          a: v === "J" && partB ? -7 : cardRanksA.get(v),
          b: handB[i] === "J" && partB ? -7 : cardRanksA.get(handB[i]),
        };
      })
      .map((a) => {
        console.log(a);
        return a;
      })
      .reduce(
        (result, { a, b }) =>
          result ? result : a > b ? 1 : a < b ? -1 : undefined,
        undefined
      );
  };
  const parsedHands = f
    .split("\n")
    .map((a) => a.split(" "))
    .map(([hand, bid]) => {
      return {
        groupedLabels: [...hand].reduce((distValues, current) => {
          const val = distValues.find((v) => v.value === current);
          if (val) {
            val.count++;
          } else {
            distValues.push({ value: current, count: 1 });
          }
          return distValues;
        }, []),
        bid,
        hand,
      };
    });
  const winningsReducer = (total, { bid }, index) => total + bid * (index + 1);
  const wildCardTransform = (a) => {
    const jLabel = a.groupedLabels.find((a) => a.value === "J");
    if (jLabel) {
      let newHand = a.groupedLabels.filter(({ value }) => value !== "J");
      if(newHand.length === 0)
        newHand = a.groupedLabels;
      const maxLabel = newHand.reduce((max, curr) =>
        curr.count > max.count ? curr : max
      );
      maxLabel.count += jLabel.count;
      return { ...a, groupedLabels: newHand };
    }
    return a;
  };

  const runGame = (partB) =>
    parsedHands
      .map((a) => (partB ? wildCardTransform(a) : a))
      .toSorted((a, b) => {
        const aLabels = a.groupedLabels;
        const bLabels = b.groupedLabels;

        if (aLabels.length > bLabels.length) {
          return -1;
        } else if (aLabels.length === bLabels.length) {
          switch (aLabels.length) {
            case 3:
            case 2:
              const maxReducer = (max, curr) =>
                curr.count > max.count ? curr : max;
              const maxA = aLabels.reduce(maxReducer).count;

              const maxB = bLabels.reduce(maxReducer).count;
              const result =
                maxA > maxB
                  ? 1
                  : maxA < maxB
                  ? -1
                  : handComparison(a.hand, b.hand, partB);
              console.log(result);
              return result;
            default:
              return handComparison(a.hand, b.hand, partB);
          }
        } else {
          return 1;
        }
      })
      .map((a) => {
        console.log(a);
        return a;
      })
      .reduce(winningsReducer, 0);

  // console.log(`Part A: ${runGame(false)}`);
  console.log(`Part B: ${runGame(true)}`);
});
