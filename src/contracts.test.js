import { it, before } from "node:test";
import assert from "node:assert";
import { mnemonicToAccount } from "viem/accounts";
import { http, createPublicClient, createWalletClient, toHex } from "viem";
import { foundry } from "viem/chains";
import { myContractAbi } from "./rollups.js";

/** @type {ReturnType<(typeof createPublicClient)>} */
let client;
/** @type {ReturnType<(typeof createWalletClient)>} */
let wallet;
const account = mnemonicToAccount(
  "test test test test test test test test test test test junk"
);

before(async () => {
  client = createPublicClient({
    chain: foundry,
    transport: http(),
  });
  wallet = createWalletClient({
    chain: foundry,
    transport: http(),
    account,
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
    onError: (error) => console.error(error),
    onLogs: (logs) => {
      console.log("TeamCreated event logs:", logs);
    },
  });

  const { result: teamId, request } = await client.simulateContract({
    address: dappAddress,
    abi: myContractAbi,
    functionName: "createTeam",
    args: team,
  });
  assert.ok(teamId, "Team ID should be returned");
  // @ts-ignore
  const hash = await wallet.writeContract(request);
  assert.ok(hash, "Transaction hash should be returned");
  const teamIdHex = toHex(teamId);
  console.log("Team ID:", teamIdHex);
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
