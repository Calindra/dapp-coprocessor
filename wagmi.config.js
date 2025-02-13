import { defineConfig } from "@wagmi/cli";
import { actions, foundry } from "@wagmi/cli/plugins";
import hardhatDeploy from "@sunodo/wagmi-plugin-hardhat-deploy";

export default defineConfig({
  out: "src/rollups.js",
  plugins: [
    // actions(),
    hardhatDeploy({
      directory: "node_modules/@cartesi/rollups/export/abi",
      includes: [
        // /InputBox/,
        // /CartesiDApp/,
        // /DAppAddressRelay/,
        // /ERC1155SinglePortal/,
        // /ERC1155BatchPortal/,
        // /ERC20Portal/,
        // /ERC721Portal/,
        // /EtherPortal/,
      ],
    }),
    foundry({
      project: "contracts",
      include: [
        "FootballTeam.sol/**",
        "MyContract.sol/**",
      ]
    }),
  ],
});
