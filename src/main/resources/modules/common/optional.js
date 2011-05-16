/**
 * Optional module util
 *
 * @public
 */

/*global require, exports */

function optional(name, callback) {
    var module;
    try {
        module = require(name);
    } catch(e) {}
    if (module && callback) {
        callback(module);
    }
    return module;
}

exports.optional = optional;
