'use strict';

var _ = require('lodash');
var moment = require('moment');
var debugHeader = require('debug')('header');
var data = require('./data');

exports = module.exports;

var headers = exports;

/* TODO: function isValidDateFormat(dateHeader) {
 return true;
 }*/

headers.parser = {
  readPreferenceHeaderValue: function (metadataHeader) {
    if (metadataHeader == null) {
      return null;
    }

    var value = metadataHeader.split(';');
    var valueName = _.trim(value[ 0 ]);
    value.splice(0, 1);
    var parameters = [];
    _.forEach(value, function (parameter) {
      parameter = parameter.split('=');
      parameters.push({
        name: parameter[ 0 ],
        value: parameter[ 1 ]
      });
    });
    var quality = _.result(_.find(parameters, 'name', 'q'), 'value');
    var level = _.result(_.find(parameters, 'name', 'level'), 'value');
    return {
      name: valueName,
      parameters: parameters,
      quality: quality,
      level: level
    };
  },

  readPreferenceHeaderValues: function (metadataHeader) {
    if (metadataHeader == null) {
      return [];
    }

    var values = metadataHeader.split(',');
    var currentThis = this;
    values = _.map(values, function (value) {
      return currentThis.readPreferenceHeaderValue(value);
    });
    return values;
  },

  readDateValue: function (headerValue) {
    // TODO: check if the header content is well-formed
    if (headerValue != null/* && isValidDateFormat(headerValue)*/) {
      // See https://github.com/moment/moment/issues/1407
      var date = Date.parse(headerValue);
      if (_.isNaN(date)) {
        return null;
      } else {
        return moment(date);
      }
    }

    return null;
  },

  readTag: function (value) {
    var weak = false;
    var tagName = null;
    if (_.startsWith(value, 'W/')) {
      weak = true;
      tagName = tagName.substring(2);
    } else {
      weak = false;
      tagName = value;
    }
    tagName = _.trim(tagName, '"');
    return {
      tag: tagName,
      weak: weak
    };
  },

  readValues: function (headerValue) {
    if (headerValue != null) {
      var values = headerValue.split(',');
      return _.map(values, function (value) {
        value = _.trim(value);
        return value;
      });
    } else {
      return [];
    }
  },

  readRangeValues: function (rangeHeaderValues, entity) {
    // Should begin with prefix 'bytes'
    if (!_.startsWith(rangeHeaderValues, 'bytes')) {
      return [];
    }

    rangeHeaderValues = rangeHeaderValues.substring(5);
    rangeHeaderValues = _.trim(rangeHeaderValues);

    var values = headers.parser.readValues(rangeHeaderValues);
    return _.map(values, function (value) {
      var subValues = value.split('/');
      if (subValues.length != 2) {
        return null;
      }

      var indicesStr = subValues[ 0 ];
      var lengthStr = subValues[ 1 ];

      var indices = indicesStr.split('-');
      if (indices.length != 2) {
        return null;
      }

      var startIndexStr = indices[ 0 ];
      var startIndex = _.parseInt(startIndexStr);
      var endIndexStr = indices[ 1 ];
      var endIndex = _.parseInt(endIndexStr);
      if (!_.isNaN(startIndex) && !_.isNaN(endIndex)) {
        var length = _.parseInt(lengthStr);
        if (!_.isNaN(length)) {
          entity.length = length;
        }

        return {
          index: startIndex,
          length: endIndex - startIndex + 1
        };
      }
    });
  }
};


function readClientInfo (rawRequest) {
  var clientInfo = {
    acceptedCharacterSets: [],
    acceptedEncodings: [],
    acceptedLanguages: [],
    acceptedMediaTypes: [],
    acceptedPatches: []
  };

  // Header accept
  var acceptHeader = rawRequest.headers.accept;
  if (acceptHeader != null) {
    clientInfo.acceptedMediaTypes = headers.parser.readPreferenceHeaderValues(
      acceptHeader);
  }

  if (_.isEmpty(clientInfo.acceptedMediaTypes)) {
    clientInfo.acceptedMediaTypes.push(new data.MediaType('*/*'));
  }

  // Header accept-charset
  var acceptCharsetHeader = rawRequest.headers[ 'accept-charset' ];
  if (acceptCharsetHeader != null) {
    clientInfo.acceptedCharacterSets
      = headers.parser.readPreferenceHeaderValues(acceptCharsetHeader);
  }

  if (_.isEmpty(clientInfo.acceptedCharacterSets)) {
    clientInfo.acceptedCharacterSets.push(new data.MediaType('*/*'));
  }

  // Header Accept-Encoding
  var acceptEncodingHeader = rawRequest.headers[ 'accept-encoding' ];
  if (acceptEncodingHeader != null) {
    clientInfo.acceptedEncodings
      = headers.parser.readPreferenceHeaderValues(acceptEncodingHeader);
  }

  if (_.isEmpty(clientInfo.acceptedEncodings)) {
    clientInfo.acceptedEncodings.push({ name: 'identity' });
  }

  // Header Accept-Language
  var acceptLanguageHeader = rawRequest.headers[ 'accept-language' ];
  if (acceptLanguageHeader != null) {
    clientInfo.acceptedLanguages
      = headers.parser.readPreferenceHeaderValues(acceptLanguageHeader);
  }

  if (_.isEmpty(clientInfo.acceptedLanguages)) {
    clientInfo.acceptedLanguages.push({ name: '*/*' });
  }

  // Header Accept-Patch
  var acceptPatchHeader = rawRequest.headers[ 'accept-patch' ];
  if (acceptPatchHeader != null) {
    clientInfo.acceptedPatches
      = headers.parser.readPreferenceHeaderValues(acceptPatchHeader);
  }

  // Header Expect
  var expectHeader = rawRequest.headers.expect;
  if (expectHeader != null) {
    clientInfo.expectations
      = headers.parser.readPreferenceHeaderValues(expectHeader);
  }

  clientInfo.agent = rawRequest.headers[ 'user-agent' ];
  clientInfo.from = rawRequest.headers.from;

  clientInfo.address = rawRequest.connection.remoteAddress;
  clientInfo.port = rawRequest.connection.remotePort;

  // Header X-Forwarded-For
  // Use property forwardedAddresses = [ (string) ]

  return clientInfo;
}

function readWarningHeaderValues (warningHeader) {

}

function readWarnings (rawRequest) {
  var warnings = [];

  var warningHeader = rawRequest.headers.warning;
  if (warningHeader != null) {
    warnings = readWarningHeaderValues(warningHeader);
  }

  return warnings;
}

function readDate (rawRequest) {
  var dateHeader = rawRequest.headers.date;
  return headers.parser.readDateValue(dateHeader);
}

function readAuthorizationHeader (authorizationHeader) {
  // TODO: clientNonce
  // TODO: digestRef
  // TODO: identifier
  // TODO: quality
  // TODO: secret
  // TODO: secretAlgorithm
  // TODO: serverNounceCount
}

function readAuthentication (rawRequest) {
  var authorizationHeader = rawRequest.headers.authorization;
  if (authorizationHeader != null) {
    return readAuthorizationHeader(authorizationHeader);
  }

  return null;
}

function readConditions (rawRequest) {
  var ifMatchHeader = rawRequest.headers[ 'If-Match' ];
  var ifNoneMatchHeader = rawRequest.headers[ 'If-None-Match' ];
  var ifRangeHeader = rawRequest.headers[ 'If-Range' ];
  var ifModifiedSinceHeader = rawRequest.headers[ 'If-Modified-Since' ];
  var ifModifiedSince = headers.parser.readDateValue(ifModifiedSinceHeader);
  var ifUnmodifiedSince = headers.parser.readDateValue(ifUnmodifiedSinceHeader);

  var conditions = {
    match: []
  };

  if (ifModifiedSince != null && ifModifiedSince.getTime() != -1) {
    conditions.modifiedSince = ifModifiedSince;
  }

  if (ifUnmodifiedSince != null && ifUnmodifiedSince.getTime() != -1) {
    conditions.unmodifiedSince = ifUnmodifiedSince;
  }

  if (_.isEmpty(ifMatchHeader)) {
    var values = ifMatchHeader.split(' ');
    _.forEach(values, function (value) {
      conditions.match.push(headers.parser.readTag(value));
    });
  }

  if (_.isEmpty(ifNoneMatchHeader)) {
    var values = ifNoneMatchHeader.split(' ');
    _.forEach(values, function (value) {
      conditions.noneMatch.push(headers.parser.readTag(value));
    });
  }

  if (_.isEmpty(ifRangeHeader)) {
    var tag = headers.parser.readTag(ifRangeHeader);
    if (tag != null) {
      conditions.rangeTag = tag;
    } else {
      conditions.rangeDate = headers.parser.readDateValue(tag);
    }
  }
}

function readEntity (rawRequest, request) {
  // Read content length
  var contentLengthHeader = rawRequest.headers[ 'content-length' ];
  var contentLength = -1;
  if (contentLengthHeader != null) {
    contentLength = _.parseInt(contentLengthHeader);
    if (_.isNaN(contentLength)) {
      contentLength = -1;
    }
  }

  var entity = request.entity;
  entity.length = contentLength;

  // Read content type and character set
  var contentTypeHeader = rawRequest.headers[ 'content-type' ];
  entity.mediaType = headers.parser.readPreferenceHeaderValue(
    contentTypeHeader);

  // Read content encoding
  var contentEncodingHeader = rawRequest.headers[ 'content-encoding' ];
  entity.encodings = headers.parser.readValues(contentEncodingHeader);

  // Read content language
  var contentLanguageHeader = rawRequest.headers[ 'content-language' ];
  entity.languages = headers.parser.readValues(contentLanguageHeader);

  // Read content range
  var contentRangeHeader = rawRequest.headers[ 'content-range' ];
  entity.ranges = headers.parser.readRangeValues(contentRangeHeader, entity);

  // Read content md5
  // To be implemented

  // Read content disposition
  // To be implemented

  return entity;
}

headers.extractHeadersFromRequest = function (rawRequest, request) {
  request.clientInfo = readClientInfo(rawRequest);
  request.date = readDate(rawRequest);
  // TODO: conditions
  // TODO: challenge response
  // TODO: cache directive getCacheDirectives
  // TODO: getAccessControlRequestMethod
  // TODO: getAccessControlRequestHeaders
  // TODO: getCookies
  readEntity(rawRequest, request);
  // TODO: getProxyChallengeResponse
  // TODO: getRanges
  // TODO: getRecipientsInfo
  // TODO: getReferrerRef
  request.warnings = readWarnings(rawRequest);
};

headers.getHost = function (rawRequest, protocol) {
  var hostHeader = rawRequest.headers.host;
  var host = 'localhost';
  var port = protocol == 'http' ? 80 : 443;
  if (hostHeader != null) {
    var hostHeaderElements = hostHeader.split(':');
    host = hostHeaderElements[ 0 ];
    port = hostHeaderElements[ 1 ];
  }

  return {
    host: host,
    port: port
  };
};

// Response headers

headers.fillHeadersAndContentInResponse = function (rawResponse, response) {
  // Location ref
  if (response.locationRef != null) {
    rawResponse.setHeader('Location', response.locationRef);
  }

  rawResponse.setHeader('Connection', 'close');

  // Entity
  if (response.entity != null
    && response.entity.mediaType != null
    && response.status.code != 204) {
    debugHeader('Filling entity content');
    rawResponse.setHeader('Content-Type', response.entity.mediaType.name);
    rawResponse.setHeader('Content-Length', response.entity.length);
    rawResponse.write(response.entity.text);
  }
};