messagebird
===========

Unofficial node.js module for the MessageBird API.

[![Build Status](https://travis-ci.org/fvdm/nodejs-messagebird.svg?branch=master)](https://travis-ci.org/fvdm/nodejs-messagebird)

* [MessageBird](https://www.messagebird.com/)
* [API documentation](https://www.messagebird.com/download/technical_documentation_nl.pdf)


Installation
------------

The best way is to install the [npm package](https://www.npmjs.com/package/messagebird).

Stable: `npm install messagebird`

Develop: `npm install fvdm/nodejs-messagebird#develop`


Configuration
-------------

param    | type    | required | description
---------|---------|----------|------------------------------------------------------
username | string  | yes      | Your API username
password | string  | yes      | Your API password
timeout  | integer | no       | Abord request adter this amount of ms, default `5000`


Usage
-----

```js
var messagebird = require ('messagebird');

messagebird.username = 'myname';
messagebird.password = 'mysecret';

messagebird.credits (function (err, data) {
  if (!err) {
    console.log ('€ %s and %s credits left', data.euro, data.credits);
  } else {
    console.log ('An error occured:');
    console.log (err);
  }
});
```


Dependencies
------------

npm should fix the dependencies for you.

* [node-xml2json](https://www.npmjs.com/package/node-xml2json) v1.0 - This is a small and fast library for XML to JSON translation.


Callback & error handling
-------------------------

Each method below takes a callback _function_ as last parameter to receive the result status and data. This function receives two parameters: `err` and `data`. When an error occurs `err` will be an instance of `Error` with stack trace and possibly additional properties, `data` won't be set. When everything is good `err` is _null_ and `data` is the result.

```js
function myCallback (err, data) {
  if (err) {
    console.log (err);
    console.log (err.stack);
  } else {
    console.log(data);
  }
}

messagebird.credits (myCallback);
```

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
