import { encodeAbiParameters } from "viem";
import seedrandom from "seedrandom";
import {
    verifyBeacon,
} from 'drand-client/beacon-verification.js'

const CHAIN_INFO = {
    "public_key": "83cf0f2896adee7eb8b5f01fcad3912212c437e0073e911fb90022d3e760183c8c4b450b6a0a6c3ac6a5776a2d1064510d1fec758c921cc22b0e17e63aaf4bcb5ed66304de9cf809bd274ca73bab4af5a6e9c76a4bc09e76eae8991ef5ece45a",
    "period": 3,
    "genesis_time": 1692803367,
    "hash": "52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971",
    "groupHash": "f477d5c89f21a17c863a7f937c6a6d15859414d2be09cd448d4279af331c5d3e",
    "schemeID": "bls-unchained-g1-rfc9380",
    "metadata": {
        "beaconID": "quicknet"
    }
};

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

async function emitNotice(data) {
    try {
        const notice_payload = { payload: data.payload };
        const response = await fetch(rollup_server + "/notice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(notice_payload),
        });

        if (response.status === 201 || response.status === 200) {
            console.log("Notice emitted successfully with data:", data);
        } else {
            console.error(`Failed to emit notice with data: ${JSON.stringify(data)}. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error("Error emitting notice:", error);
    }
}

export async function runGame(match) {
    console.log(`Running a game`, { match })
    const verifyResult = await verifyBeacon(CHAIN_INFO, match.beacon, match.beacon.round);
    console.log('verifyResult', verifyResult);
    if (!verifyResult) {
        return
    }
    const rnd = seedrandom(match.beacon.randomness)
    const tokenIds = [BigInt(match.teamA.goalkeeper.id)];
    const xpAmounts = [42n];

    let teamPowerA = 0;
    for (let p of match.teamA.defense) {
        tokenIds.push(BigInt(p.id))
        xpAmounts.push(51n)
        teamPowerA += p.level;
    }
    for (let p of match.teamA.middle) {
        tokenIds.push(BigInt(p.id))
        xpAmounts.push(64n)
        teamPowerA += p.level;
    }
    for (let p of match.teamA.attack) {
        tokenIds.push(BigInt(p.id))
        xpAmounts.push(79n)
        teamPowerA += p.level;
    }
    const teamPowerB = 2.5 * 11;
    const teamGoalsA = teamPowerA / (teamPowerB + teamPowerA);
    const teamGoalsB = teamPowerB / (teamPowerB + teamPowerA);
    const goalsA = Math.floor(rnd() * teamGoalsA * 4.3);
    const goalsB = Math.floor(rnd() * teamGoalsB * 4.3);
    const uuidBytes = '0x' + match.reqId.replace(/-/g, "")
    const encodedNotice = encodeAbiParameters(
        [
            { type: 'uint256[]' },
            { type: 'uint256[]' },
            { type: 'uint32' },
            { type: 'uint32' },
            { type: 'bytes16' },
        ],
        [tokenIds, xpAmounts, goalsA, goalsB, uuidBytes]
    );
    await emitNotice({ payload: encodedNotice })
}
