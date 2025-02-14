#!/bin/bash
set -eux

if [ -z "$(command -v cartesi-coprocessor)" ]; then
    echo "Cartesi coprocessor is not installed. Please install Cartesi coprocessor and try again."
    exit 1
fi

cartesi-coprocessor stop-devnet
cartesi-coprocessor start-devnet
cartesi doctor || sudo docker run --privileged --rm tonistiigi/binfmt:riscv
cartesi-coprocessor publish --network devnet
cartesi-coprocessor address-book

cd contracts/
cartesi-coprocessor deploy --contract-name FootballTeam --network devnet
# cartesi-coprocessor deploy --contract-name MyContract --network devnet --constructor-args