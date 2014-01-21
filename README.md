nodejs-messagebird
==================

Unofficial node.js module for the MessageBird API.

* [MessageBird](https://www.messagebird.com/)
* [API documentation](https://www.messagebird.com/download/technical_documentation_nl.pdf)



Installation
------------

The best way is to install the [npm package](https://npmjs.org/package/messagebird).

```bash
npm install messagebird
```

Alternatively you can install directly from the source code on Github, but this can be unstable!

```bash
npm install git+https://github.com/fvdm/nodejs-messagebird
```


Configuration
-------------

```
username   required   Your API username.
password   required   Your API password.
timeout    option     Abort request after this amount of milliseconds.
                      (default 5000)
```


Dependencies
------------

npm should fix the dependencies for you.

* [node-xml2json](https://npmjs.org/package/node-xml2json) v1.0 - This is a small and fast library for XML to JSON translation.


Callback & error handling
-------------------------

Each method below takes a callback _function_ as last parameter to receive the result status and data. This function received two parameters: `err` and `data`. When an error occurs `err` will be an instance of `Error` with stack trace and possibly additional properties and `data` won't be set. When everything is good `err` is _null_ and `data` whatever you're expecting.

```js
function myCallback( err, data ) {
	if( err ) {
		console.log( err )
		console.log( err.stack )
	} else {
		console.log( data )
	}
}

messagebird.credits( myCallback )
```

### Errors

```
request failed    There was an error, see err.error
request timeout   The request took too long to process, see Configuration
request closed    The request ended too early, no data processed
api error         The API returned an error, see err.resultcode and err.resultmessage
api invalid       The API returned something unreadable
api http error    The API returned an HTTP error, see err.statusCode and err.body
```


sms ( sender, destination, body, [vars], callback )
---------------------------------------------------

```
sender        required   Your name or number
destination   required   Receiver(s), comma-separated string or array
body          required   The message
vars          option     Object with more settings, see below.
callback      required   See Callback
```

```js
messagebird.sms( 'MyName', [316123456789,316098765432], 'Hello world', myCallback )
```


### vars

Object with additional settings for this SMS.

```js
var vars = {
  timestamp: '201401201803',
  reference: 'message1',
  gateway_id: 2
}

messagebird.sms( 'MyName', '123', 'Hello', vars, myCallback ) 
```


hlr ( recipients, [reference], callback )
-----------------------------------------

Lookup network information for one or more phone numbers.

See [API documentation](https://www.messagebird.com/download/technical_documentation_nl.pdf)

```
recipients   required   Numbers to lookup, comma-seperated string or array.
reference    option     String to be included http call from the API.
callback     required   See Callback.
```

```js
messagebird.hlr( '316987654321', 'user2', myCallback )
```


credits ( callback )
--------------------

Get remaining credits in your account.

```js
messagebird.credits( console.log )
```

```js
{ euros: 0, credits: 57.8 }
```


