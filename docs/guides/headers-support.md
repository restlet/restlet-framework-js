# Support of headers in Restlet JS

## Introduction

This page is extracted from the original page (http://restlet.com/technical-resources/restlet-framework/guide/2.3/core/http-headers-mapping)
on the Restlet framework website.

It provides the implementation level of both Restlet API and headers by Restlet JS. It gives a value sample for headers and their corresponding
test files.

## Useful links

* [List of HTTP header fields](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields)
* [HTTP Headers Reference](https://msdn.microsoft.com/en-us/library/aa287673(v=vs.71).aspx)

## From HTTP headers to Restlet API

### General

 HTTP header                                                                             | Supported | Restlet property name                     | Restlet property object    | Sample                                              | Test file
 --------------------------------------------------------------------------------------- | ----------| ----------------------------------------- | -------------------------- | --------------------------------------------------- | ---------------------------
 [Accept](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.1)                |     ✓     | request.clientInfo.acceptedMediaTypes     | Preference\<MediaType\>    | application/json;q=1;charset=UTF-8                  | 
 [Accept-Charset](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.2)        |           | request.clientInfo.acceptedCharacterSets  | Preference\<CharacterSet\> | utf-8                                               | 
 [Accept-Encoding](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3)       |           | request.clientInfo.acceptedEncodings      | Preference\<Encoding\>     | gzip, deflate                                       | 
 [Accept-Language](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.4)       |           | request.clientInfo.acceptedLanguages      | Preference\<Language\>     | en-US                                               | 
 [Accept-Ranges](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.5)         |           | response.serverInfo.acceptRanges          | boolean                    |                                                     | 
 [Age](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.6)                   |           | response.age                              | int                        |                                                     | 
 [Allow](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.7)                 |           | response.allowedMethods                   | Set\<Method\>              |                                                     | 
 [Authentication-Info](http://tools.ietf.org/html/rfc2617#section-3.2.3)                 |           | response.authenticationInfo               | AuthenticationInfo         |                                                     | 
 [Authorization](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.8)         |           | request.challengeResponse                 | ChallengeResponse          | Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==                  | 
 [Cache-Control](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9)         |           | message.cacheDirectives                   | List\<CacheDirective\>     | no-cache                                            | 
 [Connection](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.10)           |           | [HTTP connectors]                         | -                          | keep-alive / Upgrade                                | 
 [Content-Disposition](http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1) |           | message.entity.disposition                | Disposition                |                                                     | 
 [Content-Encoding](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11)     |           | message.entity.encodings                  | List\<Encoding\>           |                                                     | 
 [Content-Language](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.12)     |           | message.entity.languages                  | List\<Language\>           |                                                     | 
 [Content-Length](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.13)       |           | message.entity.size                       | long                       |                                                     | 
 [Content-Locathttp://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.15)          |           | message.entity.digest                     | Digest                     |                                                     | 
 [Content-Range](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.15)        |           | message.entity.range                      | Range                      |                                                     | 
 [Content-Type](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.17)         |           | message.entity.mediaType and characterSet | MediaType + CharacterSet   | application/json;q=1;charset=UTF-8                  | 
 [Cookie](http://www.w3.org/Protocols/rfc2109/rfc2109)                                   |           | request.cookies                           | Series\<Cookie\>           |                                                     | 
 [Date](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.18)                 |           | message.date                              | Date                       |                                                     | 
 [ETag](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.19)                 |           | message.entity.tag                        | Tag                        |                                                     | 
 [Expect](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.20)               |           | request.clientInfo.expectations           | List\<Expectation\>        |                                                     | 
 [Host](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.23)                 |           | request.hostRef                           | Reference                  |                                                     | 
 [If-Match](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.24)             |           | request.conditions.match                  | List\<Tag\>                |                                                     | 
 [If-Modified-Since](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.25)    |           | request.conditions.modifiedSince          | Date                       |                                                     | 
 [If-None-Match](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.26)        |           | request.conditions.noneMatch              | List\<Tag\>                |                                                     | 
 [If-Range](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.27)             |           | request.conditions.rangeTag and rangeDate | Tag + Date                 |                                                     | 
 [If-Unmodified-Since](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.28)  |           | request.conditions.unmodifiedSince        | Date                       |                                                     | 
 [Last-Modified](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.1)         |           | message.entity.modificationDate           | Date                       |                                                     | 
 [Expires](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21)              |           | message.entity.expirationDate             | Date                       |                                                     | 
 [From](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.22)                 |           | request.clientInfo.from                   | String                     |                                                     | 
 [Location](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.30)             |     ✓     | response.locationRef                      | Reference                  |                                                     | 
 [Max-Forwards](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.31)         |           | request.maxForwards                       | int                        |                                                     | 
 [Pragma](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.32)               |           | [Deprecated]                              | -                          |                                                     | 
 [Proxy-Authenticate](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.33)   |           | response.proxyChallengeRequests           | List\<ChallengeRequest\>   |                                                     | 
 [Proxy-Authorization](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.34)  |           | request.proxyChallengeResponse            | ChallengeResponse          |                                                     | 
 [Range](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.35)                |           | request.ranges                            | List\<Range\>              |                                                     | 
 [Referer](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.36)              |           | request.refererRef                        | Reference                  |                                                     | 
 [Retry-After](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.37)          |           | response.retryAfter                       | Date                       |                                                     | 
 [Server](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.38)               |           | response.serverInfo.agent                 | String                     |                                                     | 
 [Set-Cookie](http://www.w3.org/Protocols/rfc2109/rfc2109)                               |           | response.cookieSettings                   | Series\<CookieSetting\>    |                                                     | 
 [Set-Cookie2](http://www.ietf.org/rfc/rfc2965.txt)                                      |           | response.cookieSettings                   | Series\<CookieSetting\>    |                                                     | 
 [TE](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.39)                   |           | -                                         | -                          |                                                     | 
 [Trailer](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.40)              |           | -                                         | -                          |                                                     | 
 [Transfer-Encoding](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.41)    |           | [HTTP connectors]                         | -                          |                                                     | 
 [Upgrade](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.42)              |           | -                                         | -                          |                                                     | 
 [User-Agent](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.43)           |           | request.clientInfo.agent                  | String                     |                                                     | 
 [Vary](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.44)                 |           | response.dimensions                       | Set\<Dimension\>           |                                                     | 
 [Via](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.45)                  |           | message.recipientsInfo                    | RecipientInfo              |                                                     | 
 [Warning](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.46)              |           | message.warnings                          | List\<Warning\>            |                                                     | 
 [WWW-Authenticate](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.47)     |           | response.challengeRequests                | List\<ChallengeRequest\>   |                                                     | 
 X-Forwarded-For                                                                         |           | request.clientInfo.forwardedAddresses     | List\<String\>             |                                                     | 
 X-HTTP-Method-Override                                                                  |           | [Tunnel service]                          | Method                     |                                                     | 

### CORS

 HTTP header                                                                                                     | Supported | Restlet property name                     | Restlet property object    | Sample                                              | Test file
 --------------------------------------------------------------------------------------------------------------- | ----------| ----------------------------------------- | -------------------------- | --------------------------------------------------- | ---------------------------
 [Access-Control-Allow-Credentials](http://www.w3.org/TR/cors/#access-control-allow-credentials-response-header) |           | response                                  |                            | 
 [Access-Control-Allow-Headers](http://www.w3.org/TR/cors/#access-control-allow-headers-response-header)         |           | response                                  |                            | 
 [Access-Control-Allow-Methodshttp://www.w3.org/TR/cors/#access-control-allow-methods-response-header            |           | response                                  |                            | 
 [Access-Control-Allow-Origin](http://www.w3.org/TR/cors/#access-control-allow-origin-response-header)           |           | response                                  |                            | 
 [Access-Control-Expose-Headers](http://www.w3.org/TR/cors/#access-control-expose-headers-response-header)       |           | response                                  |                            | 
 [Access-Control-Max-Age](http://www.w3.org/TR/cors/#access-control-max-age-response-header)                     |           | response                                  |                            | 
 [Access-Control-Request-Method](http://www.w3.org/TR/cors/#access-control-request-method-request-header)        |           | request                                   |                            | 
 [Access-Control-Request-Headers](http://www.w3.org/TR/cors/#access-control-request-headers-request-header)      |           | request                                   |                            | 
 [Origin](http://www.w3.org/TR/cors/#origin-request-header)                                                      |           | request                                   |                            | 
