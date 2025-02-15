import { encodeAbiParameters, toBytes, keccak256 } from "viem";
import seedrandom from "seedrandom";

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
    console.log({ uuidBytes })
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
