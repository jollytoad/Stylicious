/**
 * Stylicious Web Item
 *
 * @context atl.general
 */

/*! Copyright 2011 Mark Gibson */

/*global require, document, setTimeout */

var $ = require("speakeasy/jquery").jQuery;

$(".stylicious-web-item").live('click', function(event) {
    event.preventDefault();
    setTimeout(function() {
        $(document).trigger("stylicious-open");
    },0);
});

$(document).bind("stylicious-open", function() {
    require("stylicious/editor").openEditor();
});
