#!/bin/sh

if [[ -z "$REPO_NAME" ]]; then
    echo "Unknown git repo"
    echo "Please export REPO_NAME"
    exit 1
fi

if [[ -z "$REPO" ]]; then
    REPO="https://github.com/postmanlabs/$REPO_NAME"
fi

if [[ -z "$GREENKEEPER_DEP" ]]; then
    echo "Unknown greenkeeper dependency"
    echo "Please export GREENKEEPER_DEP"
    exit 1
fi

# clone repo
mkdir -p .cache/ && cd .cache/
if [[ ! -d "$REPO_NAME" ]]; then
    git clone "$REPO" "$REPO_NAME"
fi
cd "$REPO_NAME"

# change package.json
node ../../ch_package.js "$GREENKEEPER_DEP" > package.json.new
if [[ $? -eq 2 ]]; then
    echo "Does not have a $GREENKEEPER_DEP dependency"
    rm package.json.new
    exit 0
fi
mv package.json.new package.json

# commit the change
git checkout -b 'greenkeeper_update'
git commit package.json -m "Add $GREENKEEPER_DEP to greenkeeper.ignore"

# push and create a pull request
hub fork --remote-name mine
git push --set-upstream mine greenkeeper_update \
    && hub pull-request -m "Add $GREENKEEPER_DEP to greenkeeper.ignore"
