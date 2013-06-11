# Building Restlet.JS

## Installing Grunt

Since Restlet.JS uses Grunt to build and package distributions, you firstly need to install it as described below:

    npm install grunt -g

## Installing Restlet.JS dependencies

Before building and packaging Restlet.JS, you also need to install its dependencies for development using NPM:

    npm install

## Building and packaging Restlet.JS

The package task builds all distributions:

    grunt package

The package task is global and packages all distributions (for NodeJS and browsers). More specified tasks are
also available for different use cases:

    grunt package:nodejs
    grunt package:browser
    grunt package:browserMaximum
    grunt package:browserMedium
    grunt package:browserSmall
    grunt package:browserSmallest

Built distributions are then available in the build directory and its sub-folders: nodejs for NodeJS distributions
and browser for browser ones.

## Running tests

Other tasks are also provided to run tests. The test one is global and runs all of them:

    grunt test

You can notice that this task is executed by Travis CI for the continous build.

More specified tasks are also available for different use cases:

    grunt test:nodejs
    grunt test:browser
