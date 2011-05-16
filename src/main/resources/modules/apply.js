/**
 * Stylicious - Apply custom stylesheets
 *
 * @context atl.general
 */

/*! Copyright 2011 Mark Gibson */

/*global require, document */

var stylicious = require("stylicious/stylesheets"),
    confluence = require("common/confluence"),
    $ = require("speakeasy/jquery").jQuery;

$(document).ready(function() {
    stylicious.applyStyleSheets(confluence);
});
