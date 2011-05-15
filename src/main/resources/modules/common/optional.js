/**
 * Optional module util
 *
 * @public
 */

/*global require */

function optional(name, callback) {
    var module = require(name);
    if (module && callback) {
        callback(module);
    }
    return module;
}

exports.optional = optional;
