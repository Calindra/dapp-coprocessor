#!/bin/bash
set -eux

rm -rf ./.cartesi
cartesi-coprocessor stop-devnet
docker buildx rm --force --all-inactive
docker buildx prune --all --force && docker system prune --volumes --force

date
echo "Start devnet"
cartesi-coprocessor start-devnet


date
echo "Publish devnet"
cartesi-coprocessor publish --network devnet

date
echo "Deploy contract"
export MACHINE_HASH=$(cartesi-coprocessor address-book | grep "Machine Hash" | awk '{print $NF}')
cd contracts
cartesi-coprocessor deploy --contract-name MyContract --network devnet --constructor-args 0x95401dc811bb5740090279Ba06cfA8fcF6113778 $MACHINE_HASH
cd -

date
echo "Finish"

docker logs -f cartesi-coprocessor-operator
