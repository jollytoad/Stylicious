/*! Copyright 2011 Mark Gibson */
/**
 * Stylicious - Apply custom stylesheets
 *
 * @context atl.general
 */

/*global require, document */

var stylicious = require("stylicious/stylesheets"),
    confluence = require("stylicious/confluence"),
    $ = require("speakeasy/jquery").jQuery;

$(document).ready(function() {
    stylicious.applyStyleSheets(confluence);
});
