import { it, before, after } from "node:test";
import { setTimeout } from "node:timers/promises";
import assert from "node:assert";
import { mnemonicToAccount } from "viem/accounts";
import { http, createPublicClient, createWalletClient, toHex } from "viem";
import { foundry } from "viem/chains";
import { myContractAbi, footballTeamAbi } from "./rollups.js";

/** @type {ReturnType<(typeof createPublicClient)>} */
let client;
/** @type {ReturnType<(typeof createWalletClient)>} */
let wallet;
/** @type {ReturnType<(typeof client)["watchContractEvent"]>} */
let unwatch;
const account = mnemonicToAccount(
  "test test test test test test test test test test test junk"
);

const footballAddress = "0x1429859428C0aBc9C2C47C8Ee9FBaf82cFA0F20f";
const dappAddress = "0xB0D4afd8879eD9F52b28595d31B441D079B2Ca07";

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

  unwatch = client.watchContractEvent({
    address: dappAddress,
    abi: myContractAbi,
    onError: (error) => {
      console.error("Error Events Logs:", error);
    },
    onLogs: (logs) => {
      console.log("Event logs:", logs);
    },
  });
});

after(async () => {
  await setTimeout(10_000);
  unwatch();
});

it("should pass", async () => {
  assert.strictEqual(1, 1);
});

it("should simulate team creation", async () => {
  const team = [
    "MyStarTeam",
    { name: "Rogerio Ceni", level: 2 },
    [{ name: "Cafu", level: 4 }],
    [{ name: "Bebeto", level: 7 }],
    [{ name: "Romario", level: 11 }],
  ];

  // Simulate creating a team
  const { result: teamId, request } = await client.simulateContract({
    address: dappAddress,
    abi: myContractAbi,
    functionName: "createTeam",
    args: team,
    account,
  });
  assert.ok(teamId, "Team ID should be returned");
  // @ts-ignore
  const hash = await wallet.writeContract(request);
  assert.ok(hash, "Transaction hash should be returned");
  console.log("Transaction hash:", hash);
  const teamIdHex = toHex(teamId);
  // 0xce8d0cfd5165bac9ab98b7f4ac03ed1af41de1cb88502920a07b364cbe542f9c
  console.log("Team ID:", teamIdHex);
  assert.strictEqual(
    teamId,
    93425661894681441242860048108082761268965539453039422627886306835243180765084n
  );
  const teamBigId = BigInt(teamId);
  const { result: teamName } = await client.simulateContract({
    address: footballAddress,
    abi: footballTeamAbi,
    functionName: "getTeamName",
    args: [teamBigId],
    account,
  });

  assert.strictEqual("MyStarTeam", teamName);
});

it.skip("should simulate team creation and retrieval", async () => {
  const team = [
    "MyCartesiTeam",
    { name: "Garry", level: 2 },
    [{ name: "Oshiro", level: 4 }],
    [{ name: "Ghiggino", level: 7 }],
    [{ name: "Bruno", level: 11 }],
  ];

  // @ts-ignore
  const { result } = await client.simulateCalls({
    account,
    calls: [
      {
        to: dappAddress,
        abi: myContractAbi,
        functionName: "createTeam",
        args: team,
      },
      {
        to: dappAddress,
        abi: footballTeamAbi,
        functionName: "getTeamName",
        args: [0],
      },
    ],
  });

  assert.ok(result, "Team should be returned");
  assert.strictEqual(1, 2);
});
