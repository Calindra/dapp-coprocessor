import { it, beforeEach } from "node:test";
import assert from "node:assert";
import { http, createPublicClient } from "viem";
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

it("should simulate team creation and retrieval", async () => {
  // Simulate creating a team
  await client.simulateContract({
    address: "0x0000000000000000000000000000000000000000",
    abi: myContractAbi,
    functionName: "createTeam",
    args: [
      "MyTeam",
      { name: "Goalkeeper", level: 1 },
      [{ name: "Defender1", level: 1 }],
      [{ name: "Midfielder1", level: 1 }],
      [{ name: "Attacker1", level: 1 }]
    ]
  });
  const teamName = await client.simulateContract({
    address: "0x0000000000000000000000000000000000000000",
    abi: myContractAbi,
    functionName: "getTeamName",
    args: [1] // assuming '1' is the teamId from simulation
  });

  assert.strictEqual(teamName, "MyTeam");
});
