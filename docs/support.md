# Server support

This document aims to provide hints about the coverage of REST within the JavaScript
implementation of Restlet regarding server side.

## Transports

| Header | Support |
|--------|---------|
| HTTP | Yes |
| HTTPS | No |

## Restlet element support

| Header | Support |
|--------|---------|
| Component | Yes |
| Virtual host | Partial |
| Restlet | Yes |
| Application | Partial |
| Filter | Yes |
| Guard | No |
| Server resource | Yes |

## Supported request headers

### Entity

| Header | Support |
|--------|---------|
| Content-Length | Yes |
| Content-Type | Yes |
| Content-Encoding | Yes |
| Content-Language | Yes |
| Content-Range | Yes |
| Content-Disposition | Yes |
| Content-MD5 | No |

See unit test: `headers-entity.js`

### Access controls

### Cache directive

### Client info

| Header | Support |
|--------|---------|
| Accept | Yes |
| Accept-Charset | Yes |
| Accept-Encoding | Yes |
| Accept-Language | Yes |
| Accept-Patch | Yes |
| Expect | Yes |
| User-Agent | Yes |

See unit test: `headers-client-info.js`

### Conditions

### Cookies

### Proxy security

### Ranges

### Recipient infos

### Referrer

### Security

### Warnings

## Supported response headers


# Client support

This document aims to provide hints about the coverage of REST within the JavaScript
implementation of Restlet regarding client side.

This document aims to provide hints about the coverage of REST within the JavaScript
implementation of Restlet regarding server side.

## Transports

| Header | Support |
|--------|---------|
| HTTP | No |
| HTTPS | No |

## Restlet element support

| Header | Support |
|--------|---------|
| Client resource | Yes |

## Supported request headers

## Supported response headers

