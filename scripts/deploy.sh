#! /usr/bin/env bash

set -e

API="https://api.cloud.gov"
cf login -a $API -u $CF_USERNAME -p $CF_PASSWORD

if [[ $1 = "production" ]]; then
  MANIFEST="manifest.yml"
else
  MANIFEST="manifest-${1}.yml"
fi

NAME=$(cat $MANIFEST | grep name | cut -d':' -f2 | tr -d ' ')
if [[ ! $CF_ORG ]] || [[ ! $CF_SPACE ]]; then
  CF_APP_DATA=$(cf curl "/v2/apps" -X GET -H "Content-Type: application/x-www-form-urlencoded" | jq '.resources[] | select(.entity.name == "'${NAME}'")')
  SPACE_URL=$(echo $CF_APP_DATA | jq '.entity.space_url' | tr -d '"')
  CF_SPACE_DATA=$(cf curl "${SPACE_URL}" -X GET -H "Content-Type: application/x-www-form-urlencoded")
  CF_SPACE=$(echo $CF_SPACE_DATA | jq '.entity.name' | tr -d '"')
  ORG_URL=$(echo $CF_SPACE_DATA | jq '.entity.organization_url' | tr -d '"')
  CF_ORG=$(cf curl ${ORG_URL} -X GET -H "Content-Type: application/x-www-form-urlencoded" | jq '.entity.name'  | tr -d '"')
fi

cf target -o $CF_ORG -s $CF_SPACE
cf zero-downtime-push $NAME -f $MANIFEST
