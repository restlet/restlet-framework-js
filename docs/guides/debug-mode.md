# Debug mode

Restlet JS leverages the tool [Debug](https://github.com/visionmedia/debug)

## Enabling debug mode

This means that you can have access to the debug traces with command lines like
this:

    $ DEBUG=* node myrestletapp.js
    $ DEBUG=resource node myrestletapp.js

## Available loggers

Here are the provided loggers:

| Logger    | Description |
| --------- | ----------- |
| http      | Traces related to HTTP raw processing |
| conneg    | Traces related to content negotiation |
| resource  | Traces related to Restlet resources |
| response  | Traces related to HTTP request |
| response  | Traces related to HTTP response |
| converter | Traces related to converters |
| mediatype | Traces related to media types |
| header    | Traces related to HTTP headers |
| router    | Traces related to request routing |