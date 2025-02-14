import { it, before, after } from "node:test";
import { setTimeout } from "node:timers/promises";
import assert from "node:assert";
import { mnemonicToAccount } from "viem/accounts";
import {
  http,
  createPublicClient,
  createWalletClient,
  toHex,
  keccak256,
  encodeAbiParameters,
} from "viem";
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

it.skip("should simulate team creation", async () => {
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
  const { result: teamName } = await client.simulateContract({
    address: footballAddress,
    abi: footballTeamAbi,
    functionName: "getTeamName",
    args: [teamId],
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

it("should play a match", async () => {
  const fnName = "playMatch";
  const teamName = "MyStarTeam";
  const goalkeeper = { name: "Rogerio Ceni", level: 2n };
  const defense = [{ name: "Cafu", level: 4n }];
  const middle = [{ name: "Bebeto", level: 7n }];
  const attack = [{ name: "Romario", level: 11n }];

  const { result, request: requestCreateTeam } = await client.simulateContract({
    address: dappAddress,
    abi: myContractAbi,
    functionName: "createTeam",
    args: [teamName, goalkeeper, defense, middle, attack],
    account,
  });
  assert.ok(result, "Write contract should return a result");
  const hashCreateTeam = await wallet.writeContract(requestCreateTeam);
  assert.ok(hashCreateTeam, "Transaction hash should be returned");
  console.log("Team Create Result:", result);
  console.log("Transaction hash:", hashCreateTeam);

  const { result: resultTeam } = await client.simulateContract({
    address: dappAddress,
    abi: myContractAbi,
    functionName: "getTeam",
    account,
  });
  console.log("Get Team Result:", resultTeam);
  assert.ok(resultTeam, "Get Team should return a result");

  const beacon = {
    round: 4804027n,
    signature:
      "8a9c9ddb243ee3b4c51b3602f09769ab134a85ca2912d7a68bbe7ee9a8c8ecef1c7997b7b239baf6dc6d0b8c8db9ae0502f40854ed34a2b4acf70b37ee85f37fc76a1e2d268f8c1da9127e91f9254b4781653169cf99830f48d4a700a6373052",
    previous_signature:
      "8d3a575b062a2e2b44829a493351ae00143805f36cbe77524a649ef1c5916d3b104e1b20b46052a92f8561fede3dac2d003a7678db6aa6c6af200355b35e8ac1506d3222c50ff62fa85494d4179d27436f5fc4cfa1449dff295562b013da9fe9",
    randomness:
      "02820ac3e778b52d1dfd60283ac92798ba53496e1809e594a08bd6bef2de8686",
  };

  const teamAbi = encodeAbiParameters(
    [
      { name: "teamName", internalType: "string", type: "string" },
      {
        name: "goalkeeper",
        internalType: "struct FootballTeam.Player",
        type: "tuple",
        components: [
          { name: "name", internalType: "string", type: "string" },
          { name: "level", internalType: "uint256", type: "uint256" },
        ],
      },
      {
        name: "defense",
        internalType: "struct FootballTeam.Player[]",
        type: "tuple[]",
        components: [
          { name: "name", internalType: "string", type: "string" },
          { name: "level", internalType: "uint256", type: "uint256" },
        ],
      },
      {
        name: "middle",
        internalType: "struct FootballTeam.Player[]",
        type: "tuple[]",
        components: [
          { name: "name", internalType: "string", type: "string" },
          { name: "level", internalType: "uint256", type: "uint256" },
        ],
      },
      {
        name: "attack",
        internalType: "struct FootballTeam.Player[]",
        type: "tuple[]",
        components: [
          { name: "name", internalType: "string", type: "string" },
          { name: "level", internalType: "uint256", type: "uint256" },
        ],
      },
    ],
    [teamName, goalkeeper, defense, middle, attack]
  );

  const { request: requestSetTeam } = await client.simulateContract({
    address: dappAddress,
    abi: myContractAbi,
    functionName: "setTeam",
    args: [teamAbi],
    account,
  });
  const hashSetTeam = await wallet.writeContract(requestSetTeam);
  assert.ok(hashSetTeam, "Transaction hash should be returned");
  console.log("Transaction hash:", hashSetTeam);

  const { request: getTeam } = await client.simulateContract({
    address: dappAddress,
    abi: myContractAbi,
    functionName: "getTeam",
    account,
  });
  assert.ok(getTeam, "Get Team should return a request");

  const teamHash = keccak256(teamAbi);
  console.log("Team Hash to playMatch:", teamHash);

  const contractArguments = [
    [
      beacon.round,
      toHex(beacon.randomness),
      toHex(beacon.signature),
      toHex(beacon.previous_signature),
    ],
    teamHash,
  ];

  // Simulate playing a team
  const { request } = await client.simulateContract({
    address: dappAddress,
    abi: myContractAbi,
    functionName: fnName,
    args: contractArguments,
    account,
  });
  // @ts-ignore
  const hash = await wallet.writeContract(request);
  assert.ok(hash, "Transaction hash should be returned");
  console.log("Transaction hash:", hash);
});
