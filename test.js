var testStart = Date.now ();
var util = require ('util');

// Setup
// set env MESSAGEBIRD_ACCESSKEY= MESSAGEBIRD_TIMEOUT= (Travis CI)
var app = require ('./');
app.settings.accesskey = process.env.MESSAGEBIRD_ACCESSKEY || null;

// handle exits
var errors = 0;
process.on ('exit', function () {
  var testTime = Date.now () - testStart;
  if (errors === 0) {
    console.log ('\n\033[1mDONE, no errors.\033[0m');
    console.log ('Timing: %s ms\n', testTime);
    process.exit (0);
  } else {
    console.log ('\n\033[1mFAIL, '+ errors +' error'+ (errors > 1 ? 's' : '') +' occurred!\033[0m');
    console.log ('Timing: %s ms\n', testTime);
    process.exit (1);
  }
});

// prevent errors from killing the process
process.on ('uncaughtException', function (err) {
  console.log ();
  console.error (err.stack);
  console.trace ();
  console.log ();
  errors++;
});

// Queue to prevent flooding
var queue = [];
var next = 0;

function doNext () {
  next++;
  if (queue[next]) {
    queue[next] ();
  }
}

// doTest (passErr, 'methods', [
//   ['feeds', typeof feeds === 'object']
// ]);
function doTest (err, label, tests) {
  if (err instanceof Error) {
    console.error (label +': \033[1m\033[31mERROR\033[0m\n');
    console.error (util.inspect (err, false, 10, true));
    console.log ();
    console.error (err.stack);
    console.log ();
    errors++;
  } else {
    var testErrors = [];
    tests.forEach (function (test) {
      if (test[1] !== true) {
        testErrors.push (test[0]);
        errors++;
      }
    });

    if (testErrors.length === 0) {
      console.log (label +': \033[1m\033[32mok\033[0m');
    } else {
      console.error (label +': \033[1m\033[31mfailed\033[0m ('+ testErrors.join (', ') +')');
    }
  }

  doNext ();
}

// Start the tests
queue[0]();
