import { it, beforeEach } from "node:test";
import assert from "node:assert";
import { createTestClient, http, createPublicClient } from "viem";
import { foundry } from "viem/chains";
import { myContractAbi } from "./rollups.js";

/** @type {ReturnType<(typeof createPublicClient)>} */
let client;

beforeEach(async () => {
  console.log("before each");
  client = createPublicClient({
    chain: foundry,
    transport: http(),
  });
});

it("should pass", async () => {
  assert.strictEqual(1, 1);
});

// it("should get team name", async () => {
// const { getTeamName } = client.contract(myContractAbi);
// const teamName = await getTeamName(1);
// assert.strictEqual(teamName, "Real Madrid");
// client.simulateContract(myContractAbi, {});
// });
