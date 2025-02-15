#!/bin/bash
set -eux

cartesi-coprocessor publish --network testnet

cd contracts
cartesi-coprocessor deploy --contract-name MyContract --network testnet \
    --rpc https://1rpc.io/holesky \
    -p $DEV_PRIVATE_KEY \
    --constructor-args 0xff35E413F5e22A9e1Cc02F92dcb78a5076c1aaf3 0xe4f9d5f4f9a31c6d28807d4dcc882201edc28acf60f2f9c411acd79278450ffc
cd -
