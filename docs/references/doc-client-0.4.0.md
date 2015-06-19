# Client side support - API documentation

__Restlet JS for Node__

__Version 0.4.0__

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Core elements](#core-elements)
  - [Client resource](#client-resource)
    - [Method handle([configuration], handler)](#method-handleconfiguration-handler)
    - [Method get([configuration], handler)](#method-getconfiguration-handler)
    - [Method post([configuration], handler)](#method-postconfiguration-handler)
    - [Method put([configuration], handler)](#method-putconfiguration-handler)
    - [Method patch([configuration], handler)](#method-patchconfiguration-handler)
    - [Method delete([configuration], handler)](#method-deleteconfiguration-handler)
    - [Method head([configuration], handler)](#method-headconfiguration-handler)
    - [Method options([configuration], handler)](#method-optionsconfiguration-handler)
- [Data objects](#data-objects)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Core elements


### Client resource

__`restlet.createClientResource`__

Create a client resource.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| url | String | the url to reach the resource |

Restlet allows to create a client resource for a specific URL:

    var clientResource = restlet.createClientResource(
                                   'http://myurl');

You can then execute a request for a specific HTTP method:

    restlet.createClientResource('http://myurl')
        .get(function(request, response) {
            (...)
        });

__Methods__

| Method | Description |
| ------ | ----------- |
| handle | The entry point for server resource. |
| get | Execute a GET request. |
| post | Execute a POST request. |
| put | Execute a PUT request. |
| patch | Execute a PATCH request. |
| delete | Execute a DELETE request. |
| head | Execute a HEAD request. |
| options | Execute a OPTIONS request. |

#### Method handle([configuration], handler)

The entry point for server resource.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| [configuration] | Object | the configuration object |
| handler | Function or Object | the processing element for the response |

Notice that this method shouldn't be called explicitly since it
involves within the request processing chain.

#### Method get([configuration], handler)

Execute a GET request.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| [configuration] | Object | the configuration object |
| handler | Function or Object | the processing element for the response |

This method is a shortcut for the method `handler` with the following
configuration:

    restlet.createClientResource('http://myurl')
        .handle({ method: 'GET' }, function(request, response) {
            (...)
        });

#### Method post([configuration], handler)

Execute a POST request.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| [configuration] | Object | the configuration object |
| handler | Function or Object | the processing element for the response |

This method is a shortcut for the method `handler` with the following
configuration:

    restlet.createClientResource('http://myurl')
        .handle({ method: 'POST' }, function(request, response) {
            (...)
        });

#### Method put([configuration], handler)

Execute a PUT request.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| [configuration] | Object | the configuration object |
| handler | Function or Object | the processing element for the response |

This method is a shortcut for the method `handler` with the following
configuration:

    restlet.createClientResource('http://myurl')
        .handle({ method: 'PUT' }, function(request, response) {
            (...)
        });

#### Method patch([configuration], handler)

Execute a PATCH request.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| [configuration] | Object | the configuration object |
| handler | Function or Object | the processing element for the response |

This method is a shortcut for the method `handler` with the following
configuration:

    restlet.createClientResource('http://myurl')
        .handle({ method: 'PATCH' }, function(request, response) {
            (...)
        });

#### Method delete([configuration], handler)

Execute a DELETE request.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| [configuration] | Object | the configuration object |
| handler | Function or Object | the processing element for the response |

This method is a shortcut for the method `handler` with the following
configuration:

    restlet.createClientResource('http://myurl')
        .handle({ method: 'DELETE' }, function(request, response) {
            (...)
        });

#### Method head([configuration], handler)

Execute a HEAD request.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| [configuration] | Object | the configuration object |
| handler | Function or Object | the processing element for the response |

This method is a shortcut for the method `handler` with the following
configuration:

    restlet.createClientResource('http://myurl')
        .handle({ method: 'HEAD' }, function(request, response) {
            (...)
        });

#### Method options([configuration], handler)

Execute a OPTIONS request.

| Argument | Type | Description |
| -------- | ---- | ----------- |
| [configuration] | Object | the configuration object |
| handler | Function or Object | the processing element for the response |

This method is a shortcut for the method `handler` with the following
configuration:

    restlet.createClientResource('http://myurl')
        .handle({ method: 'OPTIONS' }, function(request, response) {
            (...)
        });

## Data objects
