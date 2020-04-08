#!/bin/bash

# This script uses generate-changelog to generate the
# changelog based on the git commit history
# https://github.com/lob/generate-changelog

V_RELEASE="";
V_CANDIDATE="";
V_MAJOR=0;
V_MINOR=0;
V_PATCH=0;
V_CANDIDATE_VERSION="";
V_CANDIDATE_INCREMENT=0;
THE_VERSION=""

increment_version_variables() {
  TYPE=$1
  BASE_LIST=(`echo $V_RELEASE | tr '.' ' '`)
  V_MAJOR=${BASE_LIST[0]}
  V_MINOR=${BASE_LIST[1]}
  V_PATCH=${BASE_LIST[2]}
  if [ "$TYPE" == "p" ]; then
    V_PATCH=$((V_PATCH + 1))
  elif [ "$TYPE" == "m" ]; then
    V_MINOR=$((V_MINOR + 1))
    V_PATCH=0;
  else
    V_MAJOR=$((V_MAJOR + 1))
    V_MINOR=0
    V_PATCH=0;
  fi
}

increment_candidate_variable() {
  BASE_LIST=(`echo $V_CANDIDATE | tr '-' ' '`)
  V_CANDIDATE_VERSION=${BASE_LIST[0]}
  DIVIDER=(`echo ${BASE_LIST[1]} | tr '.' ' '`)
  V_CANDIDATE_INCREMENT=${DIVIDER[1]}
  V_CANDIDATE_INCREMENT=$((V_CANDIDATE_INCREMENT + 1))
}

generate_changelog() {
  TAG=$1
  TYPE=$2
  if [ "$TYPE" != '' ]; then
    node_modules/generate-changelog/bin/generate "-$TYPE" -f "CHANGELOG.md" -t "v$TAG"
  else
    node_modules/generate-changelog/bin/generate -f "CHANGELOG.md" -t "v$TAG"
  fi
  RETURN_CODE=$?
  if [ "$RETURN_CODE" != "0" ]; then
    echo "An error ocurred trying to generate the changelog"
    return 0
  else
    return 1
  fi
}


createRcBranch() {
  THE_VERSION=$1
  git checkout -b rc/v${THE_VERSION}
  git add CHANGELOG.md package-lock.json package.json VERSION
}


if [ -f VERSION ]; then
  BASE_STRING=`cat VERSION`
  BOTH_VERSIONS=(`echo $BASE_STRING | tr '\r' ' '`)
  V_RELEASE=${BOTH_VERSIONS[0]}
  V_CANDIDATE=${BOTH_VERSIONS[1]}
  echo "Current version: $V_RELEASE"
  echo "Enter increment type. p -> patch, m -> minor, M -> major"
  read INPUT_STRING
  if [ "$INPUT_STRING" = "p" ]  || [ "$INPUT_STRING" = "m" ] || [ "$INPUT_STRING" = "M" ]; then

    increment_version_variables $INPUT_STRING

    if [ "$INPUT_STRING" = "p" ]; then
      npm version patch
    elif [ "$INPUT_STRING" = "m" ]; then
      npm version minor
    elif [ "$INPUT_STRING" = "M" ]; then
      npm version major
    fi

    generate_changelog $V_RELEASE
    if [ "$?" -eq "1" ]; then
      echo "$V_RELEASE\n$V_MAJOR.$V_MINOR.$V_PATCH-rc.1" > VERSION
      THE_VERSION="$V_MAJOR.$V_MINOR.$V_PATCH-rc.1"
      createRcBranch $THE_VERSION
      echo "You need to change the version in the CHANGELOG.md file. "
      echo "Do not forget to tag this commit with v$THE_VERSION"
    else
      exit 3;
    fi
  else
    echo "No valid option selected";
    exit 2;
  fi

else
  echo "VERSION file is not there."
  exit 1;
fi

