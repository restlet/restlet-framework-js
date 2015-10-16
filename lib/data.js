'use strict';

var http = require('http');
var _ = require('lodash');
var debugMediaType = require('debug')('mediatype');

exports = module.exports;

var data = exports;

data.ENCODINGS = {
  '*': 'All encodings',
  compress: 'Common Unix compression',
  deflate: 'Deflate compression using the zlib format',
  'deflate-no-wrap': 'Deflate compression using the zlib format (without wrapping)',
  gzip: 'GZip compression',
  identity: 'The default encoding with no transformation',
  zip: 'Zip compression'
};

data.EXTENSIONS = {
  json: [ 'application/json' ],
  xml: [ 'text/xml', 'application/xml' ],
  yaml: [ 'text/yaml', 'application/yaml' ],
  checkExtension: function (extension, mediaTypes) {

    var configuredMediaTypes = data.EXTENSIONS[ extension ];

    if (_.isNull(configuredMediaTypes)) {
      debugMediaType('Extension ' + extension + ' is not a predefined one');
      return false;
    }

    var matchedTypes = _(mediaTypes)
      .pluck('name')
      .intersection(configuredMediaTypes)
      .value();

    var isTypeMatching = !_.isEmpty(matchedTypes);

    debugCheckExtention(isTypeMatching, extension, mediaTypes);

    return isTypeMatching;
  }
};

function debugCheckExtention (isTypeMatching, extension, mediaTypes) {

  var allMediaTypesName = _.pluck(mediaTypes, 'name')
    .join(', ');

  if (isTypeMatching) {
    debugMediaType('Media type %s match for extension %s', allMediaTypesName, extension);
  } else {
    debugMediaType('Media type %s did no match for extention %s ', allMediaTypesName, extension);
  }
}

data.Metadata = function (name) {
  this.name = name;
};

data.Metadata.prototype = {
  isCompatible: function (otherMetadata) {
    return ((otherMetadata != null)
    && (this.includes(otherMetadata)
    || otherMetadata.includes(this)));
  }
};

data.MediaType = function (name, parameters, quality, level) {
  this.name = name;
  this.parameters = parameters;
  this.quality = quality;
  this.level = level;
};

data.MediaType.getMostSpecific = function (mediaTypes) {
  if ((mediaTypes == null) || (mediaTypes.length === 0)) {
    throw new Error(
      'You must give at least one MediaType');
  }

  if (mediaTypes.length == 1) {
    return mediaTypes[ 0 ];
  }

  var mostSpecific = mediaTypes[ 0 ];

  for (var i = 1; i < mediaTypes.length; i++) {
    var mediaType = mediaTypes[ i ];

    if (mediaType != null) {
      if (mediaType.getMainType().equals('*')) {
        continue;
      }

      if (mostSpecific.getMainType().equals('*')) {
        mostSpecific = mediaType;
        continue;
      }

      if (mostSpecific.getSubType().contains('*')) {
        mostSpecific = mediaType;
        continue;
      }
    }
  }

  return mostSpecific;
};

var _TSPECIALS = '()<>@,;:/[]?=\\\"';

data.MediaType.normalizeToken = function (token) {
  // Makes sure we're not dealing with a "*" token.
  token = token.trim();
  if (_.isEmpty(token) || '*'.equals(token)) {
    return '*';
  }

  // Makes sure the token is RFC compliant.
  var length = token.length();
  var c;
  for (var i = 0; i < length; i++) {
    c = token[ i ];
    if (c <= 32 || c >= 127 || _TSPECIALS.indexOf(c) != -1) {
      throw new Error('Illegal token: ' + token);
    }
  }

  return token;
};

// TODO: add MediaType#normalizeType

_.assign(data.MediaType, data.Metadata);

data.MediaType.prototype = {
  getMainType: function () {
    var result = null;

    if (this.name != null) {
      var index = this.name.indexOf('/');

      // Some clients appear to use name types without subtypes
      if (index == -1) {
        index = this.name.indexOf(';');
      }

      if (index == -1) {
        result = this.name;
      } else {
        result = this.name.substring(0, index);
      }
    }

    return result;
  },

  getParent: function () {
    var result = null;

    if (this.getParameters().size() > 0) {
      result = data.MediaType.valueOf(this.getMainType()
        + '/' + this.getSubType());
    } else {
      if (this.getSubType().equals('*')) {
        result = this.equals(ALL) ? null : ALL;
      } else {
        result = data.MediaType.valueOf(this.getMainType() + '/*');
      }
    }

    return result;
  },

  getSubType: function () {
    var result = null;

    if (this.name != null) {
      var slash = this.name.indexOf('/');

      if (slash == -1) {
        // No subtype found, assume that all subtypes are accepted
        result = '*';
      } else {
        var separator = this.name.indexOf(';');
        if (separator == -1) {
          result = this.name.substring(slash + 1);
        } else {
          result = this.name.substring(slash + 1, separator);
        }
      }
    }

    return result;
  },

  includes: function (includedMediaType, ignoreParameters) {
    var result = this.equals(ALL) || this.equals(included);

    if (!result) {
      if (this.getMainType().equals(includedMediaType.getMainType())) {
        // Both media types are different
        if (this.getSubType().equals(includedMediaType.getSubType())) {
          if (ignoreParameters) {
            result = true;
          } else {
            // Check parameters:
            // Media type A includes media type B if for each param
            // name/value pair in A, B contains the same name/value.
            result = true;
            for (var i = 0; result && i < this.parameters.size(); i++) {
              var param = this.parameters[ i ];
              var includedParam = _.find(includedMediaType.parameters,
                { name: param.name });

              // If there was no param with the same name, or the
              // param with the same name had a different value,
              // then no match.
              result = (includedParam != null
              && param.value === includedParam.value);
            }
          }
        } else if (this.getSubType().equals('*')) {
          result = true;
        } else if (this.getSubType().startsWith('*+')
          && _.endsWith(includedMediaType.getSubType(),
            this.getSubType().substring(2))) {
          result = true;
        }
      }
    }

    return result;
  },

  isConcrete: function () {
    return !this.name().contains('*');
  }
};

data.Status = function (code, message) {
  this.code = code;
  this.reasonPhrase = http.STATUS_CODES[ code ];
  if (message != null) {
    this.message = message;
    this.description = message;
  } else {
    this.message = this.reasonPhrase;
    this.description = this.reasonPhrase;
  }
};

data.Status.prototype = {
  /**
   * Indicates if the status is a client error status, meaning "The request
   * contains bad syntax or cannot be fulfilled".
   *
   * @param code the code of the status.
   * @return True if the status is a client error status.
   */
  isClientError: function () {
    return (this.code >= 400) && (this.code <= 499);
  },

  /**
   * Indicates if the status is a connector error status, meaning "The
   * connector failed to send or receive an apparently valid message".
   *
   * @return True if the status is a connector error status.
   */
  isConnectorError: function () {
    return (this.code >= 1000) && (this.code <= 1099);
  },

  /**
   * Indicates if the status is an error (client or server) status.
   *
   * @return True if the status is an error (client or server) status.
   */
  isError: function () {
    return this.isClientError() || this.isServerError()
      || this.isConnectorError();
  },

  /**
   * Indicates if the status is a global error status, meaning "The server has
   * definitive information about a particular user".
   *
   * @return True if the status is a global error status.
   */
  isGlobalError: function () {
    return (this.code >= 600) && (this.code <= 699);
  },

  /**
   * Indicates if the status is an information status, meaning "request
   * received, continuing process".
   *
   * @return True if the status is an information status.
   */
  isInformational: function () {
    return (this.code >= 100) && (this.code <= 199);
  },

  /**
   * Indicates if the status is a redirection status, meaning "Further action
   * must be taken in order to complete the request".
   *
   * @return True if the status is a redirection status.
   */
  isRedirection: function () {
    return (this.code >= 300) && (this.code <= 399);
  },

  /**
   * Indicates if the status is a server error status, meaning "The server
   * failed to fulfill an apparently valid request".
   *
   * @return True if the status is a server error status.
   */
  isServerError: function () {
    return (this.code >= 500) && (this.code <= 599);
  },

  /**
   * Indicates if the status is a success status, meaning "The action was
   * successfully received, understood, and accepted".
   *
   * @return True if the status is a success status.
   */
  isSuccess: function () {
    return (this.code >= 200) && (this.code <= 299);
  }
};
