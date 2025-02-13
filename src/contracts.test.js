import { it, before } from "node:test";
import assert from "node:assert";
import { http, createPublicClient, toHex } from "viem";
import { foundry } from "viem/chains";
import { myContractAbi } from "./rollups.js";

/** @type {ReturnType<(typeof createPublicClient)>} */
let client;

before(async () => {
  client = createPublicClient({
    chain: foundry,
    transport: http(),
  });
});

it("should pass", async () => {
  assert.strictEqual(1, 1);
});

const footballAddress = "0x1429859428C0aBc9C2C47C8Ee9FBaf82cFA0F20f";
const dappAddress = "0xB0D4afd8879eD9F52b28595d31B441D079B2Ca07";

it("should simulate team creation and retrieval", async () => {
  const team = [
    "MyStarTeam",
    { name: "Rogerio Ceni", level: 2 },
    [{ name: "Cafu", level: 4 }],
    [{ name: "Bebeto", level: 7 }],
    [{ name: "Romario", level: 11 }],
  ];

  // Simulate creating a team
  client.watchContractEvent({
    address: dappAddress,
    abi: myContractAbi,
    eventName: "TeamCreated",
    onLogs: (logs) => {
      console.log("TeamCreated event logs:", logs);
    },
  });

  const { result: teamId } = await client.simulateContract({
    address: dappAddress,
    abi: myContractAbi,
    functionName: "createTeam",
    args: team,
  });
  assert.ok(teamId, "Team ID should be returned");
  console.log("Team ID:", teamId);
  assert.strictEqual(
    teamId,
    93425661894681441242860048108082761268965539453039422627886306835243180765084n
  );
  // const { result: teamName } = await client.simulateContract({
  //   address: footballAddress,
  //   abi: footballTeamAbi,
  //   functionName: "getTeamName",
  //   args: [teamId],
  // });

  // assert.strictEqual("MyStarTeam", teamName); // Fixing the assertion to match created team's name
});
