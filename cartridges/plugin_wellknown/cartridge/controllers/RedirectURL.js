'use strict';

/**
 * @namespace RedirectURL
 */

var server = require('server');
var base = module.superModule;

server.extend(base);

/**
 * First checks if the current request is an ACME challenge request before redirecting to the default behaviour. If a
 * challenge is found and configured it will show the ACME challenge.
 */
server.prepend('Start', function (req, res, next) {
    var Logger = require('dw/system/Logger').getLogger('ACME');
    var RedirectMgr = require('dw/web/URLRedirectMgr');
    var location = RedirectMgr.getRedirectOrigin();
    var matchResult = location.match('.+well-known/acme-challenge/(.+)');

    Logger.debug('ACME -- Checking URL {0} for matches. Found matches {1}', location, matchResult && matchResult.toString());

    if (matchResult && matchResult.length === 2) {
        var currentSite = require('dw/system/Site').getCurrent();
        var wellKnownFilename = currentSite.getCustomPreferenceValue('wellKnownFileName');
        Logger.debug('ACME -- Match found, does {0} match the site preference {1}?', matchResult[1], wellKnownFilename);
        if (wellKnownFilename === matchResult[1]) {
            var responseWriter = response.getWriter();
            responseWriter.print(currentSite.getCustomPreferenceValue('wellKnownValue'));
            responseWriter.close();
        }
    } else {
        next();
    }
});

module.exports = server.exports();
