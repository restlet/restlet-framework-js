/*
 * Copyright 2005-2017 Restlet
 *
 * The contents of this file are subject to the terms of one of the following
 * open source licenses: Apache 2.0 or or EPL 1.0 (the "Licenses"). You can
 * select the license that you prefer but you may not use this file except in
 * compliance with one of these Licenses.
 *
 * You can obtain a copy of the Apache 2.0 license at
 * http://www.opensource.org/licenses/apache-2.0
 *
 * You can obtain a copy of the EPL 1.0 license at
 * http://www.opensource.org/licenses/eclipse-1.0
 *
 * See the Licenses for the specific language governing permissions and
 * limitations under the Licenses.
 *
 * Alternatively, you can obtain a royalty free commercial license with less
 * limitations, transferable or non-transferable, directly at
 * http://restlet.com/products/restlet-framework
 *
 * Restlet is a registered trademark of Restlet S.A.S.
 */

'use strict';

var async = require('async');
var _ = require('lodash');
require('colors');
var spawn = require('child_process').spawn;

// See http://www.fileformat.info/info/unicode/char/2713/index.htm
// See http://www.fileformat.info/info/unicode/char/274c/index.htm

function logTask(msg, task) {
  process.stdout.write('   ' + msg);
  task(function(success) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    var indicator = success ? '\u2713'.green : '\u00d7'.red ;
    process.stdout.write(' ' + indicator + ' ' + msg);
    process.stdout.write('\n');
  });
}

function executeCommand(cmdString, cmdParameters, onExit) {
  var cmd = spawn(cmdString, cmdParameters);

  cmd.on('exit', function(code) {
    // Traces: console.log('child process exited with code ' + code);
    onExit(code === 0);
  });
}

function executeTask(msg, taskString, taskParameters, onEndCallback) {
  logTask(msg, function(end) {
    executeCommand(taskString, taskParameters, function(success) {
      end(success);
      onEndCallback();
    });
  });
}

function executeNpmTask(msg, taskName, onEndCallback) {
  executeTask(msg, 'npm', [ 'run', taskName], onEndCallback);
}

var cmds = [];
// Code
cmds.push({ msg: 'Check code style', task: 'code:style'});
cmds.push({ msg: 'Check JS Hint', task: 'code:jshint'});
// Tests
cmds.push({ msg: 'Tests', task: 'test:default'});
// Browser
cmds.push({ msg: 'Create browser content', task: 'code:browser'});
cmds.push({ msg: 'Create browser content (minified)',
  task: 'code:browser:minify'});
// Docs
cmds.push({ msg: 'Create doc', task: 'doc:generate:server'});
cmds.push({ msg: 'Create doc', task: 'doc:generate:client'});

async.series(_.map(cmds, function(cmd) {
  return function(callback) {
    executeNpmTask(cmd.msg, cmd.task, function() {
      callback();
    });
  };
}));
