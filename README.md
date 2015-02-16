messagebird
===========

MessageBird API client and server to process status reports and inbound VMN messages.

[![Build Status](https://travis-ci.org/fvdm/nodejs-messagebird.svg?branch=master)](https://travis-ci.org/fvdm/nodejs-messagebird)

* [MessageBird](https://www.messagebird.com/)
* [API documentation](https://www.messagebird.com/nl/developers)


Examples
--------

### Client

```js
var messagebird = require ('messagebird');
messagebird.settings.accesskey = 'live_abc123';

// Send SMS message
messagebird.client (
  {
    method: 'POST',
    path:   '/messages',
    fields: {
      reference:  'ref-'+ parseInt (Date.now ()),
      recipients: '31698765432,316123456789',
      body:       'Hello world'
    }
  },
  console.log
);
```


### Server

```js
var messagebird = require ('messagebird');
messagebird.settings.accesskey = 'live_abc123';

// Setup
var server = messagebird.server ({
  port: 8080,
  pathMessage: '/mbapi/message',
  pathVMN: '/mvapi/vmn'
});

// Sent message status report
server.on ('message', console.log);

// Inbound message (VMN)
server.on ('vmn', console.log);

// start server
server.listen();
```


Installation
------------

Stable: `npm install messagebird`

Develop: `npm install fvdm/nodejs-messagebird#develop`


Configuration
-------------

param     | type    | required | description
----------|---------|----------|------------------------------------------------------
accesskey | string  | no       | Your API access key, or set in client/server config
timeout   | integer | no       | Abord request after this amount of ms, default `5000`


Client usage
------------

The API client takes care of all communication with the MessageBird API. It is only one
_function_ with one parameter _object_:


parameter | type     | required | default | description
----------|----------|----------|---------|-------------------------------------------
method    | string   | no       | GET     | GET or POST
path      | string   | yes      |         | Request path, i.e. `/messages`
fields    | object   | no       |         | Request fields, i.e. `{name: 'value'}`
callback  | function | yes      |         | Function to process response, see [Callback](#callback) below
          |          |          |         | 
accesskey | string   | no       |         | API access key
timeout   | integer  | no       | 5000    | Wait time in milliseconds
iface     | string   | no       |         | Outbound network interface, i.e. `::ffff:12.34.56.78`


```js
var request = {
  method: 'POST',
  path: '/messages',
  fields: {
    reference: 'database-id',
    recipients: 'number,number,number',
    body: 'The message to send'
  },
  
};

client ( request, callback );
```


Server usage
------------


#### Errors

message         | description
----------------|--------------------------------------------------------------------------
request failed  | There was an error, see `err.error`
request timeout | The request took too long to process, see [Configuration](#configuration)
request closed  | The request ended too early, no data processed
api error       | The API returned an error, see `err.resultcode` and `err.resultmessage`
api invalid     | The API returned something unreadable
api http error  | The API returned an HTTP error, see `err.statusCode` and `err.body`


sms ( sender, destination, body, [vars], callback )
---------------------------------------------------

Send sms to one or multiple phone numbers.

param       | type     | required | description
------------|----------|----------|---------------------------------------------
sender      | string   | yes      | Your name or number
destination | array    | yes      | Receiver(s)
body        | string   | yes      | The message
vars        | object   | no       | More settings, see below.
callback    | function | yes      | See [Callback](#callback-error-handling)

```js
messagebird.sms ('MyName', [316123456789,316098765432], 'Hello world', myCallback);
```


#### vars

Object with additional settings for this SMS.

```js
var vars = {
  timestamp: '201401201803',
  reference: 'message1',
  gateway_id: 2
};

messagebird.sms ('MyName', '123', 'Hello', vars, myCallback);
```


hlr ( recipients, [reference], callback )
-----------------------------------------

Lookup network information for one or more phone numbers.

param      | type     | required | description
-----------|----------|----------|------------------------------------------------
recipients | array    | yes      | Number to lookup
reference  | string   | no       | String to be included in http call from the API
callback   | function | yes      | See [Callback](#callback-error-handling)


```js
messagebird.hlr ('316987654321', 'user2', myCallback);
```


credits ( callback )
--------------------

Get remaining credits in your account.

```js
messagebird.credits (console.log);
```

```js
{ euros: 0, credits: 57.8 }
```


License
-------

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org>


Author
------

Franklin van de Meent
| [Website](https://frankl.in)
| [Github](https://github.com/fvdm)
