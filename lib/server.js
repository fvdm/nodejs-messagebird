/*
Name           messagebird server.js
Description:   MessageBird API module for node.js
Author:        Franklin van de Meent (https://frankl.in)
Sourcecode:    https://github.com/fvdm/nodejs-messagebird
Feedback:      https://github.com/fvdm/nodejs-messagebird/issues
Service:       MessageBird (https://www.messagebird.com)
License:       Unlicense / Public Domain
               (https://raw.github.com/fvdm/nodejs-messagebird/master/LICENSE)
*/

var app = module.parent.exports;
var querystring = require ('querystring');
var urltool = require ('url');
var EE = require ('events').EventEmitter;
var server = new EE();

// Defaults
var settings = {
  accesskey: app.settings.accesskey || null,
  protocol: 'http',
  port: 8080,
  iface: null,
  timeout: 5000,
  path_message: '/message',
  path_vmn: '/vmn',
  path_hlr: '/hlr',
  tlsKey: null,
  tlsCert: null,
  whitelist: app.settings.whitelist || null
};

// Request listener
function doRequest (request, response) {
  if (typeof settings.whitelist === 'string' && settings.whitelist.indexOf (request.socket.remoteAddress) < 0) {
    server.emit ('notice', {
      message: 'request denied',
      code: 403,
      remoteAddress: request.socket.remoteAddress,
      remotePort: request.socket.remotePort
    });

    response.writeHead (403);
    response.end ('access denied');
    return;
  }

  var url = urltool.parse (request.url, true);
  var query = url.query;
  var method = request.method;

  switch (url.pathname) {
    case settings.path_hlr:
      server.emit ('hlr', query);
      break;

    case settings.path_message:
      server.emit ('message', query);
      break;

    case settings.path_vmn:
      server.emit ('vmn', query);
      break; 

    default:
      response.writeHead (400);
      response.end ('Invalid request');
      return;
  }

  response.writeHead (200);
  response.end ('ok');
}


// Listen
server.listen = function () {
  var http = null;
  var options = {};

  if (settings.tlsKey && settings.tlsCert) {
    options.key = settings.tlsKey;
    options.cert = settings.tlsCert;
  }

  if (settings.protocol === 'https') {
    http = require ('https').createServer (options, doRequest);
  } else {
    http = require ('http').createServer (doRequest);
  }

//  http.on ('request', doRequest);
/*
  http.on ('connection', doConnection);
  http.on ('close', doClose);
  http.on ('clientError', doClientError);
*/

  http.setTimeout (parseInt (settings.timeout || 5000), function event_timeout (socket) {
    server.emit ('notice', {
      message: 'request timeout',
      remoteAddress: socket.remoteAddress,
      remotePort: socket.remotePort
    });
  });

  http.listen (settings.port, settings.iface, function event_listen (obj) {
    server.emit ('listen', obj);
  });

  http.on ('clientError', function event_error (error, socket) {
    server.emit ('error', {
      error: error,
      remoteAddress: socket.remoteAddress,
      remotePort: socket.remotePort
    });
  });
};

// Init
module.exports = function (props) {
  settings.protocol = props.protocol || settings.protocol;
  settings.port = props.port || settings.port;
  settings.iface = props.iface || settings.iface;
  settings.timeout = props.timeout || settings.timeout;
  settings.accesskey = props.accesskey || settings.accesskey;
  settings.tlsKey = props.tlsKey || null;
  settings.tlsCert = props.tlsCert || null;
  settings.whitelist = props.whitelist || settings.whitelist;
  module.parent.exports.settings.accesskey = module.parent.exports.settings.accesskey || settings.accesskey;
  return server;
}
