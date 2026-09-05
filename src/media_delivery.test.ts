import test from "node:test";
import assert from "node:assert/strict";
import { groupListings } from "./media_delivery.ts";

test("creator delivery keeps listings from every source together", () => {
  const result = groupListings([
    { source: "one", title: "A", url: "https://one.test/a", creator: "Mina" },
    { source: "two", title: "B", url: "https://two.test/b", creator: "Mina" },
    { source: "one", title: "C", url: "https://one.test/c", creator: "Ravi" }
  ]);
  assert.deepEqual(result, [
    { creator: "Mina", listings: [
      { source: "one", title: "A", url: "https://one.test/a", creator: "Mina" },
      { source: "two", title: "B", url: "https://two.test/b", creator: "Mina" }
    ] },
    { creator: "Ravi", listings: [{ source: "one", title: "C", url: "https://one.test/c", creator: "Ravi" }] }
  ]);
});
