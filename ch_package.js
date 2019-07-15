#!/usr/bin/env node

const fs = require('fs'),
    process = require('process'),

    // Exit helper function
    exit = function (err, code) {
        console.error(err);
        process.exit(Number.isFinite(code) ? code : (err ? 1 : 0));
    },

    // Checks if the package has the given dependency
    packageHasDependency = function (package, dependency) {
        var dependencyInList = (['dependencies', 'devDependencies'].filter((item) => {
            if (package[item].hasOwnProperty(dependency)) {
                return true;
            }
            return false;
        }));

        return dependencyInList.length !== 0;
    },

    // Adds the given dependency to Greenkeeper's ignore list
    addDependencyToGreenkeeperIgnore = function (package, dependency) {
        if (!package.greenkeeper) {
            package.greenkeeper = {};
        }

        if (!package.greenkeeper.ignore) {
            package.greenkeeper.ignore = [];
        }

        package.greenkeeper.ignore.push(dependency);
    };


fs.readFile('./package.json', (err, packageData) => {
    if (err) {
        return exit(err);
    }

    var package,
        dependencyToIgnore = process.argv && process.argv[2];

    // worst case if dependency itself is missed by user
    if (!(dependencyToIgnore && (typeof dependencyToIgnore === 'string'))) {
        return exit('Need argument: dependency to ignore', 1);
    }

    // we parse json of package data in a try-block to trap scenarios where the
    // package file contains invalid string content (not JSON)
    try {
        package = JSON.parse(packageData);
    }
    catch (e) {
        return exit(e);
    }

    if (!packageHasDependency(package, dependencyToIgnore)) {
        return exit('Package does not have the dependency', 2);
    }

    addDependencyToGreenkeeperIgnore(package, dependencyToIgnore);

    // log the new package.json to console
    console.log(JSON.stringify(package, null, 2));
});
