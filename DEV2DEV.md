# DEV2DEV

## Ollama RISC-V [Optional]

If you need compile ollama using Dockerfile.ollama:

```sh
echo "Compile ollama"
rm -rfv ./ollama
docker build -t builder-riscv64 -f Dockerfile.ollama .
docker rm builder-riscv64-container || true
docker create --name builder-riscv64-container builder-riscv64
docker cp builder-riscv64-container:/opt/build/ollama ./ollama
docker rm builder-riscv64-container
```

after running:

```sh
cartesi-coprocessor start-devnet
```

You should see:

```sh
contracts/lib/openzeppelin-contracts-v4.9.0/lib/forge-std/lib/ds-test'
GIT::NOTE:: Cloning into '/home/codespace/.cartesi-coprocessor-repo/contracts/lib/eigenlayer-middleware/lib/eigenlayer-contracts/lib/openzeppelin-contracts-v4.9.0/lib/forge-std/lib/ds-test'...
GIT::  Submodule path 'contracts/lib/eigenlayer-middleware/lib/eigenlayer-contracts/lib/openzeppelin-contracts-v4.9.0/lib/forge-std/lib/ds-test': checked out '6da7dd8f7395f83e1fb6fa88a64ba9a030f85d4f'
GIT::  Submodule path 'contracts/lib/eigenlayer-middleware/lib/forge-std': checked out 'f73c73d2018eb6a111f35e4dae7b4f27401e9421'
GIT::NOTE:: Submodule 'lib/ds-test' (https://github.com/dapphub/ds-test) registered for path 'contracts/lib/eigenlayer-middleware/lib/forge-std/lib/ds-test'
GIT::NOTE:: Cloning into '/home/codespace/.cartesi-coprocessor-repo/contracts/lib/eigenlayer-middleware/lib/forge-std/lib/ds-test'...
GIT::  Submodule path 'contracts/lib/eigenlayer-middleware/lib/forge-std/lib/ds-test': checked out 'e282159d5170298eb2455a6c05280ab5a73a4ef0'
GIT::  Submodule path 'contracts/lib/eigenlayer-middleware/lib/openzeppelin-contracts': checked out '8c49ad74eae76ee389d038780d407cf90b4ae1de'
GIT::  Submodule path 'contracts/lib/eigenlayer-middleware/lib/openzeppelin-contracts-upgradeable': checked out '6b9807b0639e1dd75e07fa062e9432eb3f35dd8c'
GIT::  Submodule path 'contracts/lib/forge-std': checked out 'b93cf4bc34ff214c099dc970b153f85ade8c9f66'
✅  Successfully updated submodules.
✅ Successfully built Devnet containers.
✅ Successfully pulled changes to Devnet containers.
⠙ Starting devnet containers...
⠹ Starting devnet containers...
⠸ Starting devnet containers...
⠼ Starting devnet containers...
✅ Cartesi-Coprocessor devnet environment started.
```

## Publish the dapp

After running:

```sh
cartesi-coprocessor publish --network devnet
```

Output:

```sh
CARTESI::
         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI
        \ /   MACHINE
         '

[INFO  rollup_http_server] starting http dispatcher service...
[INFO  rollup_http_server::http_service] starting http dispatcher http service!
[INFO  actix_server::builder] starting 1 workers
[INFO  actix_server::server] Actix runtime found; starting in Actix runtime
[INFO  rollup_http_server::dapp_process] starting dapp: node index.js
HTTP rollup_server url is http://127.0.0.1:5004

✅ Cartesi Program built successfully.
Running Cartesi Container...
CARIZE:: Unable to find image 'ghcr.io/zippiehq/cartesi-carize:latest' locally
CARIZE:: latest: Pulling from zippiehq/cartesi-carize
CARIZE:: 648e0aadf75a: Pulling fs layer
CARIZE:: 14ef99282469: Pulling fs layer
CARIZE:: d0b296c04d4a: Pulling fs layer
CARIZE:: 7f55e939ee69: Pulling fs layer
CARIZE:: 2ff09c2388d4: Pulling fs layer
CARIZE:: 7f55e939ee69: Waiting
CARIZE:: 2ff09c2388d4: Waiting
CARIZE:: 14ef99282469: Verifying Checksum
CARIZE:: 14ef99282469: Download complete
CARIZE:: 7f55e939ee69: Verifying Checksum
CARIZE:: 7f55e939ee69: Download complete
CARIZE:: 648e0aadf75a: Verifying Checksum
CARIZE:: 648e0aadf75a: Download complete
CARIZE:: 2ff09c2388d4: Verifying Checksum
CARIZE:: 2ff09c2388d4: Download complete
CARIZE:: d0b296c04d4a: Verifying Checksum
CARIZE:: d0b296c04d4a: Download complete
CARIZE:: 648e0aadf75a: Pull complete
CARIZE:: 14ef99282469: Pull complete
CARIZE:: d0b296c04d4a: Pull complete
CARIZE:: 7f55e939ee69: Pull complete
CARIZE:: 2ff09c2388d4: Pull complete
CARIZE:: Digest: sha256:60593e49af50a8c4df8762ec57c4b2446badd6b4bb389fefaf68694cce6ac46a
CARIZE:: Status: Downloaded newer image for ghcr.io/zippiehq/cartesi-carize:latest
CARIZE:: generating ED25519 keypair...done
CARIZE:: peer identity: 12D3KooWStJupnPzcYz2ZyuQHq6jr5Ys7cs1NvdXs6CDptH6FLqG
CARIZE:: initializing IPFS node at /root/.ipfs
CARIZE:: CAR and JSON files successfully created!
CARIZE::  Cumulative size extracted to output.size successfully!
✅ CARIZE generated successfully.
✅ File uploaded successfully!
⠙ Waiting for solver to finish publication process...                                                                                            ✅ Successfully published your program with machine hash cf3a4c7609b9238412ff5ef1871d66b31db03ed360d51fe6fcc89c1b1ef8b4b7
✅ RESPONSE:: {"operator_ids_with_states":{"931a13987a36a6508d2ade6961f55d97209a7b42f66a7f0fdd899dea8fcb7d4d":"ready"}}
```

## Show operator logs

```sh
docker logs -f cartesi-coprocessor-operator
```

## Deploy contract

```sh
cartesi-coprocessor address-book
```

```sh
Machine Hash         0xf21ff2bf2c197dde50241077210819e21a2d117ca63e91cba091861f35255bc4
Devnet_task_issuer   0x95401dc811bb5740090279Ba06cfA8fcF6113778
Testnet_task_issuer  0xff35E413F5e22A9e1Cc02F92dcb78a5076c1aaf3
payment_token        0xc5a5C42992dECbae36851359345FE25997F5C42d
```

the first arg is the `Devnet_task_issuer`, the second arg is the `Machine Hash`

```sh
cd contracts
cartesi-coprocessor deploy --contract-name MyContract --network devnet --constructor-args 0x95401dc811bb5740090279Ba06cfA8fcF6113778 0xf21ff2bf2c197dde50241077210819e21a2d117ca63e91cba091861f35255bc4
cd -
```

```sh
FORGE::RESPONSE:: No files changed, compilation skipped
Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Deployed to: 0x1429859428C0aBc9C2C47C8Ee9FBaf82cFA0F20f
Transaction hash: 0x8253d9713e29e13cd6504e9e06121137bebf9f103433a699d7df6609a0416ae3

Creating directory to record deployments at "/workspaces/dapp-coprocessor/contracts/deployment_history"
✅ Deployment info saved successfully.
```

the `Deployed to` value is the "dapp address"

```sh
export DAPP_ADDRESS=0x1429859428C0aBc9C2C47C8Ee9FBaf82cFA0F20f
```

Send an input:

```sh
cast send $DAPP_ADDRESS "runExecution(bytes)" 0xdeadbeef \
    --rpc-url http://127.0.0.1:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

You should see something like this log below on the operator terminal

```sh
[INFO  rollup_http_server::http_service] received new request of type ADVANCE
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 344 "-" "node" 0.031488
Received finish status 200
Received advance request data {"metadata":{"chain_id":0,"app_contract":"0x0000000000000000000000000000000000000000","msg_sender":"0x0000000000000000000000000000000000000000","block_number":0,"block_timestamp":0,"prev_randao":"0x0000000000000000000000000000000000000000000000000000000000000000","input_index":0},"payload":"0xdeadbeef"}
```

new hash

cartesi-coprocessor deploy --contract-name MyContract --network devnet --constructor-args 0x95401dc811bb5740090279Ba06cfA8fcF6113778 0x080f4506b004934952e5fa3d3cd0626c0a1768133d7c407f12d8cbee9c2c8a44

new "deployed to" 0x922D6956C99E12DFeB3224DEA977D0939758A1Fe

```sh
export DAPP_ADDRESS=0xB0D4afd8879eD9F52b28595d31B441D079B2Ca07
```

start ollama

```sh
cast send $DAPP_ADDRESS "runExecution(bytes)" 0x6e6f687570202e2f6f6c6c616d61207365727665203e202f746d702f6f6c6c616d612e6c6f6720323e26312026 \
    --rpc-url http://127.0.0.1:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

sleep 10

```sh
cast send $DAPP_ADDRESS "runExecution(bytes)" 0x736c656570203130 \
    --rpc-url http://127.0.0.1:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

cat logs

```sh
cast send $DAPP_ADDRESS "runExecution(bytes)" 0x636174202f746d702f6f6c6c616d612e6c6f67 \
    --rpc-url http://127.0.0.1:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

send hi

```sh
cast send $DAPP_ADDRESS "runExecution(bytes)" 0x6c6c6d206869 \
    --rpc-url http://127.0.0.1:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

2e2f6f6c6c616d61207365727665

bash -c "ps aux | grep ollama"

```sh
cast send $DAPP_ADDRESS "runExecution(bytes)" 0x62617368202d632022707320617578207c2067726570206f6c6c616d6122 \
    --rpc-url http://127.0.0.1:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

ls -lah

```sh
cast send $DAPP_ADDRESS "runExecution(bytes)" 0x6c73202d6c6168 \
    --rpc-url http://127.0.0.1:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

whoami

```sh
cast send $DAPP_ADDRESS "runExecution(bytes)" 0x77686f616d69 \
    --rpc-url http://127.0.0.1:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```


```sh
cast send $DAPP_ADDRESS "runExecution(bytes)" 0x6c73202d6c61202f7573722f73686172652f6f6c6c616d612f2e6f6c6c616d612f6d6f64656c73 \
    --rpc-url http://127.0.0.1:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

ollama ls

```sh
cast send $DAPP_ADDRESS "runExecution(bytes)" 0x2e2f6f6c6c616d61206c73 \
    --rpc-url http://127.0.0.1:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

cat /proc/meminfo

```sh
cast send $DAPP_ADDRESS "runExecution(bytes)" 0x636174202f70726f632f6d656d696e666f \
    --rpc-url http://127.0.0.1:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

ls -la /tmp

```sh
cast send $DAPP_ADDRESS "runExecution(bytes)" 0x6c73202d6c6168202f746d70 \
    --rpc-url http://127.0.0.1:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

echo "hi"

```sh
cast send $DAPP_ADDRESS "runExecution(bytes)" 0x6563686f2022686922 \
    --rpc-url http://127.0.0.1:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

echo "hi2"

```sh
cast send $DAPP_ADDRESS "runExecution(bytes)" 0x6563686f202268693222 \
    --rpc-url http://127.0.0.1:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
After this command below the system stops:

echo "hi" > /tmp/ollama.log

```sh
cast send $DAPP_ADDRESS "runExecution(bytes)" 0x6563686f2022686922203e202f746d702f6f6c6c616d612e6c6f67 \
    --rpc-url http://127.0.0.1:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
