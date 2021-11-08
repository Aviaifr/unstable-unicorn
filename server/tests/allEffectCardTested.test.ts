import { readdirSync } from "fs";
import { cardList } from "../src/GameModules/cardLists";

/**
 * As ong as this card is in your Stable, cards you play cannot be Neigh’d.
 *
 */
describe("Validate tests for cards", () => {
  const internallyTested = ["unicornswap"]; //cards that are tested via other cards
  const irrelevantFiles = ['allEffectCardTested', 'memLeakHelper']
  const testsList = readdirSync("./tests")
    .map((f) => f.split(".")[0])
    .concat(internallyTested).filter(t=> !irrelevantFiles.includes(t));
  const typesWithEffects = [
    "magic",
    "magical",
    "instant",
    "upgrade",
    "downgrade",
  ];
  const cardsWithEffects = Object.keys(cardList.base).filter((k) =>
  typesWithEffects.includes((cardList.base as any)[k].type));
  test("All baseset cards has tests", () => {
    expect(testsList.length).toBe(
      cardsWithEffects.length
    );
  });
  test("Found Tests for all baseset", () => {
    cardsWithEffects.forEach(c => expect(testsList).toContain(c))
  });
});
