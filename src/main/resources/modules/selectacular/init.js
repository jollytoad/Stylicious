/**
 * Initialise Selectacular Web Item
 *
 * @context atl.general
 */

/*! Copyright 2012 Mark Gibson */

/*global require, document, setTimeout */

var $ = require("speakeasy/jquery").jQuery,
    optional = require("common/optional").optional;

$(".selectacular-web-item").live('click', function(event) {
    event.preventDefault();
    setTimeout(function() {
        optional("selectacular/selector", function(selectacular) {
            $(document).trigger("selectacular", [selectacular]);
            selectacular.start();
        });
    },0);
});
