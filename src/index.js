// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
const { ethers } = require("ethers");
import { exec } from "node:child_process";
import { setTimeout } from "node:timers/promises"

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`Stderr: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
};

const exampleFetcher = async (prompt) => {
  console.log("Fetching example");
  try {
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "smollm:135m",
        prompt: prompt,
        stream: false,
      }),
    });
    console.log("Response", response);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};


async function handle_advance(data) {
  try {
    console.log('starting ollama serve');
    const output = await runCommand('nohup ./ollama serve > /dev/null 2>&1 &');
    console.log(`Output:\n${output}`);
  } catch (error) {
    console.error(error);
  }
  const hexString = data.payload.substring(2); // "Hello World" in hex
  const buffer = Buffer.from(hexString, "hex");
  const decodedString = buffer.toString("utf-8");
  console.log("Advance decoded string", decodedString);
  console.log("Received advance request data " + JSON.stringify(data));

  if (decodedString.startsWith("llm")) {
    await setTimeout(10_000);
    await exampleFetcher(decodedString.replace(/^llm/, "").trim());
    console.log('Sending accept after the LLM')
    return "accept"
  }

  try {
    const output = await runCommand(decodedString);
    console.log(`Output:\n${output}`);
  } catch (error) {
    console.error(error);
  }
  console.log('Sending accept after running:', decodedString)
  return "accept";
}

async function handle_inspect(data) {
  try {
    console.log('Inspect -> starting ollama serve');
    const output = await runCommand('nohup ./ollama serve &');
    console.log(`Output:\n${output}`);
  } catch (error) {
    console.error(error);
  }
  console.log("Received inspect request data " + JSON.stringify(data));
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
