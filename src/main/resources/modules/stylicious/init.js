/**
 * Register Stylicious with Selectacular and wire up Stylicious Web Item
 *
 * @context atl.general
 */

/*! Copyright 2012 Mark Gibson */

/*global require, document, setTimeout */

var $ = require("speakeasy/jquery").jQuery,
    optional = require("common/optional").optional;

function addStyliciousToSelectacular() {
    optional("selectacular/tools", function(tools) {
        tools.addTool("insert-in-stylicious", {
            label: "css",
            desc: "Insert into Stylicious",
            action: function(selector) {
                optional("stylicious/editor", function(stylicious) {
                    stylicious.selectacularAction(selector);
                });
            },
            required: true,
            close: true
        });
    });
}

$(".stylicious-web-item").live('click', function(event) {
    event.preventDefault();
    setTimeout(function() {
        optional("stylicious/editor", function(stylicious) {
            addStyliciousToSelectacular();
            stylicious.openEditor();
        });
    },0);
});

$(document).bind("selectacular", addStyliciousToSelectacular);
