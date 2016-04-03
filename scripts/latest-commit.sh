#! /usr/bin/env bash

cd $(git rev-parse --show-cdup)

FILE=$(find . -name latest-commit.txt)

if [[ -n $FILE ]]; then
  git rev-parse HEAD > $FILE
else
  :
fi
