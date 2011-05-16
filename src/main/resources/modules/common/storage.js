/**
 * Abstract access to storage facilities
 */

/*! Copyright 2011 Mark Gibson */

/*global require, exports, localStorage */

var optional = require("common/optional").optional,
    aoStorage = optional("aoso/storage");

var store = {},
    tmpStorage = {
        getItem: function(key) {
            return store[key];
        },
        setItem: function(key, value) {
            store[key] = value;
        },
        removeItem: function(key) {
            delete store[key];
        },
        temporary: true
    };

exports.storage = aoStorage || localStorage || tmpStorage;
