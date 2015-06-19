# Create version guide

The guide describes the different tasks to check that the current code is
ready for a version and to create a version.

## Check code source

Be sure that all the code is commited and pushed within the remote repository
using the command:

    $ git status

## Check code source

Before packaging a version, be sure to have checked the code style using
the command:

    $ npm run code:style

Before packaging a version, be sure to have checked the JSHint rules using
the command:

    $ npm run code:jshint

## Run tests

Before packaging a version, be sure to have run successfully tests
using the command:

    $ npm run test:default

## Check continuous integration

Check that latest buils within the two continuous integration tools are
successful:

* [Travis CI](https://travis-ci.org/restlet/restlet-framework-js)
* [AppVeyor](https://ci.appveyor.com/project/templth/restlet-framework-js)

## Code coverage (optional)

Check that the coverage of tests is enough for the version:

* [Coveralls](https://coveralls.io/r/restlet/restlet-framework-js)

## Generating reference docs

Check if the reference docs for both server and client sides are 
generated.

If not, run the two following commands:

    $ npm run doc:generate:server
    $ npm run doc:generate:client

## Generating client code for browsers

Check if the client code for browsers are generated.

If not, run the two following commands:

    $ npm run code:browser
    $ npm run code:browser:minify

## Git

Create a tag within the Git repository for the current version to
release:

    $ git tag -a v0.4.0 -m 'version 0.4.0'

Notice that the format of tag is: `v<major>.<minor>.<increment>`.

The following commands allows you to get hints about the tags in
the local repository:

    $ git tag
    v0.1
    v1.3

    $ git tag -l 'v1.8.5*'
    v1.8.5
    v1.8.5-rc0
    v1.8.5-rc1

Push the tag to the remote repository:

    $ git push --tags

Don't forget to include the `--tags` switch with your push command to the remote
repository.

## NPM

Publish the package within NPM using the following command:

    $ npm publish

This following link provides interesting hints regarding creation and
management of NPM package:

* [Publishing NPM packages](https://docs.npmjs.com/getting-started/publishing-npm-packages)



## Bower

For the first version, you need to register the package in Bower using the following
command:

    $ bower register restlet git://github.com/restlet/restlet-framework-js.git

You can then get hints about the package

    $ bower info restlet

Bower relies on Github tags, so there is nothing more to do for next versions.

This following link provides interesting hints regarding creation and
management of Bower package:

* [Creating and maintaining your own Bower package](http://bob.yexley.net/creating-and-maintaining-your-own-bower-package/)

## Version number for the next version

Increment the version number of the project for the next release in
the following files:

* `package.json` for NPM
* `bower.json` for Bower

## Summary

* Check everything is commited
* Check code style
* Check JSHint
* Run tests
* Check continuous integration
* Check code coverage (optional)
* Create tag for version
* Push tag in the remote repository
* Publish in NPM
* Check NPM for published version
* Check Bower for published version
* Increment number version