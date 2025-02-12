# syntax=docker.io/docker/dockerfile:1

FROM ollama/ollama:0.5.7 AS agentic
RUN <<EOF
  set -eux
  nohup ollama serve&
  sleep 10
  ollama pull smollm:135m
EOF

# build stage: includes resources necessary for installing dependencies

# Here the image's platform does not necessarily have to be riscv64.
# If any needed dependencies rely on native binaries, you must use
# a riscv64 image such as cartesi/node:20-jammy for the build stage,
# to ensure that the appropriate binaries will be generated.
FROM node:20.16.0-bookworm AS build-stage

WORKDIR /opt/cartesi/dapp
COPY . .
RUN <<EOF
  npm ci
  npm run build
EOF

# runtime stage: produces final image that will be executed

# Here the image's platform MUST be linux/riscv64.
# Give preference to small base images, which lead to better start-up
# performance when loading the Cartesi Machine.
FROM --platform=linux/riscv64 cartesi/node:20.16.0-jammy-slim

LABEL io.cartesi.rollups.sdk_version=0.11.1
LABEL io.cartesi.rollups.ram_size=1024Mi

ARG DEBIAN_FRONTEND=noninteractive
RUN <<EOF
set -e
apt-get update
apt-get install -y --no-install-recommends \
  busybox-static=1:1.30.1-7ubuntu3
rm -rf /var/lib/apt/lists/* /var/log/* /var/cache/*
useradd --create-home --user-group dapp
EOF

ARG MACHINE_EMULATOR_TOOLS_VERSION=0.16.1
ADD https://github.com/cartesi/machine-emulator-tools/releases/download/v${MACHINE_EMULATOR_TOOLS_VERSION}/machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb /
RUN dpkg -i /machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb \
  && rm /machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb

ENV PATH="/opt/cartesi/bin:${PATH}"

WORKDIR /opt/cartesi/dapp
COPY --chown=dapp:dapp --from=build-stage /opt/cartesi/dapp/dist .

ADD \
  --chown=dapp:dapp \
  --chmod=755 \
  # --checksum=sha256:83436eb5a903021837896fcc5265ff4bfe4f07d9c0231f569de7bc415f1cd4bf \
  https://s3.us-east-1.amazonaws.com/s3.ai.eitri.tech/ollama .

ENV CUDA_VISIBLE_DEVICES="-1"

ENV OLLAMA_MODELS=/usr/share/ollama/.ollama/models
RUN <<EOF
  mkdir -p --verbose ${OLLAMA_MODELS}
  chown -R --verbose dapp:dapp ${OLLAMA_MODELS}
EOF

COPY --from=agentic /root/.ollama/models/ ${OLLAMA_MODELS}/

RUN <<EOF
  touch /tmp/ollama.log
  chmod --verbose 777 /tmp/ollama.log
  chown --verbose dapp:dapp /tmp/ollama.log
  echo "hi" > ollama.log

EOF

ENV ROLLUP_HTTP_SERVER_URL="http://127.0.0.1:5004"

ENTRYPOINT ["rollup-init"]
CMD ["node", "index.js"]
