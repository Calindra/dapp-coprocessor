#!/bin/bash
set -eux

# last machine hash 98be235714b878becde7de4b6d1f5bcce81d1ac891828d95826abb887aa793b0

cartesi-coprocessor publish --network testnet

cartesi-coprocessor publish-status --network testnet

export TESTNET_TASK_ISSUER=0xff35E413F5e22A9e1Cc02F92dcb78a5076c1aaf3

cd contracts
cartesi-coprocessor deploy --contract-name MyContract --network testnet \
    --rpc https://1rpc.io/holesky \
    -p $DEV_PRIVATE_KEY \
    --constructor-args $TESTNET_TASK_ISSUER 0x98be235714b878becde7de4b6d1f5bcce81d1ac891828d95826abb887aa793b0
cd -

# MyContract address -> 0xf67d5f475B37c3fD64E56031833442f0ABd6E60B