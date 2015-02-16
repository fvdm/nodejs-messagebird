/*
Name           messagebird.js
Description:   MessageBird API module for node.js
Author:        Franklin van de Meent (https://frankl.in)
Sourcecode:    https://github.com/fvdm/nodejs-messagebird
Feedback:      https://github.com/fvdm/nodejs-messagebird/issues
Service:       MessageBird (https://www.messagebird.com)
License:       Unlicense / Public Domain
               (https://raw.github.com/fvdm/nodejs-messagebird/master/LICENSE)

Usage:         var messagebird = require ('messagebird') ({accesskey: 'abc'});

Client:        var client = messagebird.client;
               client ('POST', '/messages', {recipients: ['123'], body: 'hello'}, messageSent);

Server:        var server = messagebird.server ({port: 8080});
               server.on ('message', messageStatusFunction);
               server.on ('hlr', hlrStatusFunction);
               server.on ('voice', voiceStatusFunction);
               server.listen ();
*/

module.exports = {
  settings: {
    accesskey: null
  },
  client: function (props, callback) {
    return require ('./lib/client') (props, callback);
  },
  server: function (props) {
    return require ('./lib/server') (props);
  }
};
