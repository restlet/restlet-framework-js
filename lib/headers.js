'use strict';

var _ = require('lodash');
var moment = require('moment');

exports = module.exports;

var headers = exports;

function readPreferenceHeaderValues(metadataHeader) {
  var values = metadataHeader.split(',');
  values = _.map(values, function(value) {
    value = value.split(';');
    var valueName = _.trim(value[0]);
    value.splice(0, 1);
    var parameters = [];
    _.forEach(value, function(parameter) {
      parameter = parameter.split('=');
      parameters.push({
        name: parameter[0],
        value: parameter[1]
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
  });
  return values;
}

function readDateValue(value) {
  // TODO: check if the header content is well-formed
  if (value != null && isValidDateFormat(value)) {
    // See https://github.com/moment/moment/issues/1407
    return moment(new Date(dateHeader));
  }

  return null;
}


function readClientInfo(rawRequest) {
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
    clientInfo.acceptedMediaTypes = readPreferenceHeaderValues(acceptHeader);
  }

  if (_.isEmpty(clientInfo.acceptedMediaTypes)) {
    clientInfo.acceptedMediaTypes.push({ name: '*/*' });
  }

  // Header accept-charset
  var acceptCharsetHeader = rawRequest.headers['accept-charset'];
  if (acceptCharsetHeader != null) {
    clientInfo.acceptedCharacterSets
      = readPreferenceHeaderValues(acceptCharsetHeader);
  }

  if (_.isEmpty(clientInfo.acceptedCharacterSets)) {
    clientInfo.acceptedCharacterSets.push({ name: '*/*' });
  }

  // Header Accept-Encoding
  var acceptEncodingHeader = rawRequest.headers['accept-encoding'];
  if (acceptEncodingHeader != null) {
    clientInfo.acceptedEncodings
      = readPreferenceHeaderValues(acceptEncodingHeader);
  }

  if (_.isEmpty(clientInfo.acceptedEncodings)) {
    clientInfo.acceptedEncodings.push({ name: 'identity' });
  }

  // Header Accept-Language
  var acceptLanguageHeader = rawRequest.headers['accept-language'];
  if (acceptLanguageHeader != null) {
    clientInfo.acceptedLanguages
      = readPreferenceHeaderValues(acceptLanguageHeader);
  }

  if (_.isEmpty(clientInfo.acceptedLanguages)) {
    clientInfo.acceptedLanguages.push({ name: '*/*' });
  }

  // Header Accept-Patch
  var acceptPatchHeader = rawRequest.headers['accept-patch'];
  if (acceptPatchHeader != null) {
    clientInfo.acceptedPatches
      = readPreferenceHeaderValues(acceptPatchHeader);
  }

  // Header Expect
  var acceptPatchHeader = rawRequest.headers['accept-patch'];
  if (acceptPatchHeader != null) {
    clientInfo.acceptedPatches
      = readPreferenceHeaderValues(acceptPatchHeader);
  }

  clientInfo.agent = rawRequest.headers['user-agent'];
  clientInfo.from = rawRequest.headers.from;

  clientInfo.address = rawRequest.connection.remoteAddress;
  clientInfo.port = rawRequest.connection.remotePort;

  // Header X-Forwarded-For
  // Use property forwardedAddresses = [ (string) ]

  return clientInfo;
}

function readWarningHeaderValues(warningHeader) {

}

function readWarnings(rawRequest) {
  var warnings = [];

  var warningHeader = rawRequest.headers['warning'];
  if (warningHeader != null) {
    warnings = readWarningHeaderValues(warningHeader);
  }

  return warnings;
}

function isValidDateFormat(dateHeader) {
  return true;
}

function readDate(rawRequest) {
  var dateHeader = rawRequest.headers['date'];
  return readDateValue(dateHeader);
}

function readAuthorizationHeader(authorizationHeader) {
  /*private volatile String clientNonce;
    private volatile Reference digestRef;
    private volatile String identifier;
    private volatile String quality;
    private volatile char[] secret;
    private volatile String secretAlgorithm;
    private volatile int serverNounceCount;*/
}

function readAuthentication(rawRequest) {
  var authorizationHeader = rawRequest.headers['authorization'];
  if (authorizationHeader != null) {
    return readAuthorizationHeader(authorizationHeader);
  }

  return null;
}

function readTag(value) {
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
}

function readConditions(rawRequest) {
  var ifMatchHeader = rawRequest.headers['If-Match'];
  var ifNoneMatchHeader = rawRequest.headers['If-None-Match'];
  var ifRangeHeader = rawRequest.headers['If-Range'];
  var ifModifiedSinceHeader = rawRequest.headers['If-Modified-Since'];
  var ifModifiedSince = readDateValue(ifModifiedSinceHeader);
  var ifUnmodifiedSince = readDateValue(ifUnmodifiedSinceHeader);

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
      _.forEach(values, function(value) {
      conditions.match.push(readTag(value));
      });
    }

    if (_.isEmpty(ifNoneMatchHeader)) {
      var values = ifNoneMatchHeader.split(' ');
      _.forEach(values, function(value) {
      conditions.noneMatch.push(readTag(value));
      });
    }

    if (_.isEmpty(ifRangeHeader)) {
      var tag = readTag(ifRangeHeader);
      if (tag != null) {
        conditions.rangeTag = tag;
      } else {
        conditions.rangeDate = readDateValue(tag);
      }
    }
}

function readEntity(rawRequest) {
  var contentLengthHeader = rawRequest.headers['content-length'];
  var contentTypeHeader = rawRequest.headers['content-type'];
  var contentLength = -1;
  if (contentLengthHeader != null) {
    contentLength = _.parseInt(contentLengthHeader);
  }

  // HEADER_CONTENT_ENCODING
  // HEADER_CONTENT_LANGUAGE
  // HEADER_CONTENT_LOCATION
  // 

   /*if (header.getName().equalsIgnoreCase(
                    HeaderConstants.HEADER_CONTENT_ENCODING)) {
                new EncodingReader(header.getValue()).addValues(result
                        .getEncodings());
            } else if (header.getName().equalsIgnoreCase(
                    HeaderConstants.HEADER_CONTENT_LANGUAGE)) {
                new LanguageReader(header.getValue()).addValues(result
                        .getLanguages());
            } else if (header.getName().equalsIgnoreCase(
                    HeaderConstants.HEADER_CONTENT_TYPE)) {
                ContentType contentType = new ContentType(header.getValue());
                result.setMediaType(contentType.getMediaType());
                result.setCharacterSet(contentType.getCharacterSet());
            } else if (header.getName().equalsIgnoreCase(
                    HeaderConstants.HEADER_CONTENT_RANGE)) {
                RangeReader.update(header.getValue(), result);
            } else if (header.getName().equalsIgnoreCase(
                    HeaderConstants.HEADER_CONTENT_MD5)) {
                result.setDigest(new Digest(Digest.ALGORITHM_MD5, Base64
                        .decode(header.getValue())));
            } else if (header.getName().equalsIgnoreCase(
                    HeaderConstants.HEADER_CONTENT_DISPOSITION)) {
                try {
                    result.setDisposition(new DispositionReader(header
                            .getValue()).readValue());
                } catch (IOException ioe) {
                    Context.getCurrentLogger().log(
                            Level.WARNING,
                            "Error during Content-Disposition header parsing. Header: "
                                    + header.getValue(), ioe);
                }
            }*/

  return {
    mediaType: contentTypeHeader,
    length: contentLength
  };
}

headers.extractHeadersFromRequest = function(rawRequest, request) {
  request.clientInfo = readClientInfo(rawRequest);
  // date
  request.date = readDate(rawRequest);
  // conditions
  // challenge response
  // cache directive getCacheDirectives
  // getAccessControlRequestMethod
  // getAccessControlRequestHeaders
  // getCookies
  // getEntity
  request.entity = readEntity(rawRequest);
  // getProxyChallengeResponse
  // getRanges
  // getRecipientsInfo
  // getReferrerRef
  request.warnings = readWarnings(rawRequest);
};

headers.getHost = function(rawRequest, protocol) {
  var hostHeader = rawRequest.headers['host'];
  var host = 'localhost';
  var port = protocol == 'http' ? 80 : 443;
  if (hostHeader != null) {
    var hostHeaderElements = hostHeader.split(':');
    host = hostHeaderElements[0];
    port = hostHeaderElements[1];
  }

  return {
    host: host,
    port: port
  };
};
