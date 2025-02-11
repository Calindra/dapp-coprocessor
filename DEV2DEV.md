
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
⠙ Waiting for solver to finish publication process...                                                                                            ✅ Successfully published your program with machine hash c604befefeead1aa2dfe897e8e85d7dc058c205049750e071460ded54bf9c2dc
✅ RESPONSE:: {"operator_ids_with_states":{"931a13987a36a6508d2ade6961f55d97209a7b42f66a7f0fdd899dea8fcb7d4d":"ready"}}
```

## Show operator logs

```sh
docker logs -f cartesi-coprocessor-operator
```

cast send <contract_address> "runExecution(bytes)" <hex_encoded_input> \
    --rpc-url <your_rpc_url> \
    --private-key <your_private_key>