#!/usr/bin/env bash

# upgrade npm
sudo npm install -g npm@latest

# upgrade corepack
sudo npm install -g corepack@latest --force

# enable pnpm
sudo corepack enable pnpm

# use latest pnpm
corepack use pnpm@latest-10

# install dependencies
pnpm add -D eslint @eslint/js globals prettier
pnpm add body-parser express minimist
