// const corsProxy = require('cors-anywhere');

// // Listen on a specific host via the HOST environment variable.
// const host = process.env.HOST || '0.0.0.0';
// // Listen on a specific port via the PORT environment variable.
// const port = process.env.PORT || 8080;

// corsProxy.createServer({
//     originWhitelist: ['http://localhost:3000', 'https://adjans.com.tr', 'https://cors-server.adjans.com.tr'],
//     requireHeader: ['origin', 'x-requested-with'],
//     removeHeaders: ['cookie', 'cookie2']
// }).listen(port, host, () => {
//     console.log('Running CORS Anywhere on ' + host + ':' + port);
// });


var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 8080;

var originBlacklist = parseEnvList(process.env.CORSANYWHERE_BLACKLIST);
var originWhitelist = parseEnvList(process.env.CORSANYWHERE_WHITELIST);
function parseEnvList(env) {
  if (!env) {
    return [];
  }
  return env.split(',');
}

var checkRateLimit = require('./lib/rate-limit')(process.env.CORSANYWHERE_RATELIMIT);
var cors_proxy = require('./lib/cors-anywhere');
cors_proxy.createServer({
    originBlacklist: originBlacklist,
    originWhitelist: [
        'http://localhost:3000',
        'https://adjans.com.tr',
        'https://univerliseli.com',
        'https://www.univerliseli.com',
        'https://cors-server.adjans.com.tr'
    ],
    requireHeader: ['origin', 'x-requested-with'],
    checkRateLimit: checkRateLimit,
    removeHeaders: [
        'cookie',
        'cookie2',
        'x-request-start',
        'x-request-id',
        'via',
        'connect-time',
        'total-route-time',
        // 'x-forwarded-for',
        // 'x-forwarded-proto',
        // 'x-forwarded-port',
    ],
    redirectSameOrigin: true,
    httpProxyOptions: {
        // Do not add X-Forwarded-For, etc. headers, because Heroku already adds it.
        xfwd: false,
    },
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});
