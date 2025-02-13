#!/bin/bash

set -eux

git config pull.rebase false

export BUILDX_PROGRESS=plain
export BUILDKIT_PROGRESS=plain

if [ -z "$(command -v docker)" ]; then
    echo "Docker is not installed. Please install Docker and try again."
    exit 1
fi

if [ -z "$(command -v cartesi)" ]; then
    npm i -g @cartesi/cli
    sudo docker run --privileged --rm tonistiigi/binfmt:riscv || true
    cartesi doctor
fi

if [ -z "$(command -v cast)" ]; then
    curl -L https://foundry.paradigm.xyz | bash
    source ~/.bashrc
    foundryup
fi

# Check if there are any running containers before trying to stop them
if [ ! -z "$(docker ps -q)" ]; then
    echo "Stopping running containers..."
    docker stop $(docker ps -q)
fi

docker buildx rm --force --all-inactive
docker buildx prune --all --force && docker system prune --volumes --force

if [ -z "$(command -v rustc)" ]; then
    echo "Install Rust"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    . "$HOME/.cargo/env"
fi

echo "Install coprocessor cli"
cargo install cartesi-coprocessor

