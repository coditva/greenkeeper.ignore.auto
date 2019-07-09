#!/usr/bin/env node

const fs = require('fs');
const process = require('process');

const GREENKEEPER_DEP = process.argv[2] || process.exit(1);

var packageFile = fs.readFileSync('./package.json');
var package = JSON.parse(packageFile);

// check if the package has the given dependency
if (!
    ((package.dependencies && package.dependencies.hasOwnProperty(GREENKEEPER_DEP))
    || (package.devDependencies && package.devDependencies.hasOwnProperty(GREENKEEPER_DEP)))){
    process.exit(2);
}

if (!package.greenkeeper) {
    package.greenkeeper = {};
}
if (!package.greenkeeper.ignore) {
    package.greenkeeper.ignore = [];
}

package.greenkeeper.ignore.push(GREENKEEPER_DEP);

// log the new package.json to console
console.log(JSON.stringify(package, null, 2));
