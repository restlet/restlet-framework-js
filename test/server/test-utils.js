var _ = require('lodash');

exports = module.exports;

var testUtils = exports;

testUtils.createRawRequest = function(headers) {
  var handlers = {};
  return {
    headers: headers,
    connection: {
      remoteAddress: 'localhost',
      remotePort: '35034'
    },
    resume: function() {
    },
    on: function(event, handler) {
      if (handlers.event == null) {
        handlers.event = [];
      }
      handlers.event.push(handler);
    },
    trigger: function(event, data) {
      if (handlers.event != null) {
        var eventHandlers = handlers.event;
        _.forEach(eventHandlers, function(eventHandler) {
          eventHandler(event, data);
        });
      }
    }
  };
};

testUtils.createRequest = function(method, path) {
  var handlers = {};
  return {
    method: method,
    reference: {
      path: path
    },
    on: function(event, handler) {
      if (handlers.event == null) {
        handlers.event = [];
      }
      handlers.event.push(handler);
    },
    resume: function() {

    },
    trigger: function(event, data) {
      if (handlers.event != null) {
        var eventHandlers = handlers.event;
        _.forEach(eventHandlers, function(eventHandler) {
          eventHandler(event, data);
        });
      }
    }
  };
};

