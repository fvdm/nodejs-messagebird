/*
Name           messagebird client.js
Description:   MessageBird API module for node.js
Author:        Franklin van de Meent (https://frankl.in)
Sourcecode:    https://github.com/fvdm/nodejs-messagebird
Feedback:      https://github.com/fvdm/nodejs-messagebird/issues
Service:       MessageBird (https://www.messagebird.com)
License:       Unlicense / Public Domain
               (https://raw.github.com/fvdm/nodejs-messagebird/master/LICENSE)
*/

var app = module.parent.exports;
var https = require ('https');
var querystring = require ('querystring');

var settings = {
  accesskey: app.settings.accesskey || null,
  iface: null
};

module.exports = function (props) {
  var body;

  // prevent multiple callbacks
  var complete = false;
  function doCallback (err, res) {
    if (!complete) {
      complete = true;
      typeof props.callback === 'function' && props.callback (err, res || null);
    }
  }

  // build request
  var options = {
    hostname: 'rest.messagebird.com',
    path: props.path,
    method: props.method || 'GET',
    headers: {
      'Authorization': 'AccessKey '+ app.settings.accesskey,
      'User-Agent': 'messagebird.js (https://github.com/fvdm/nodejs-messagebird)'
    }
  };

  if (typeof props.fields === 'object') {
    body = querystring.stringify (props.fields);
  }

  if (props.method === 'POST' && props.fields) {
    options.headers ['Content-Type'] = 'application/x-www-form-urlencoded';
    options.headers ['Content-Length'] = body.length;
  }
  else if (props.method === 'GET' && props.fields) {
    path +'?'+ body;
    body = null;
  }

  if (app.settings.iface) {
    options.localAddress = app.settings.iface;
  }

  var request = https.request (options);

  // response
  request.on ('response', function (response) {
    var data = [];
    var size = 0;
    var err = null;

    response.on ('data', function (ch) {
      data.push (ch);
      size += ch.length;
    });

    response.on ('close', function () {
      doCallback (new Error ('request closed'));
    });

    response.on ('end', function () {
      var error = null;
      data = Buffer.concat (data, size) .toString ();

      try {
        data = JSON.parse (data);
      }
      catch (e) {
        error = new Error ('api invalid');
        error.body = data;
      }

      if (response.statusCode >= 300) {
        error = new Error ('api error');
        error.httpCode = response.statusCode;
        error.errors = data.errors || [];
        data = null;
      }

      doCallback (error, data);
    });
  });

  // error
  request.on ('error', function (error) {
    var err = new Error ('request failed');
    if (error.code === 'ECONNRESET') {
      err = new Error ('request timeout');
    }
    err.error = error;
    doCallback (err);
  });

  // timeout
  request.on ('socket', function (socket) {
    socket.setTimeout (parseInt (app.settings.timeout) || 5000);
    socket.on ('timeout', function () {
      request.abort ();
    });
  });

  // run it
  request.end (body);
};
