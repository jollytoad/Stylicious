/**
 * Enhance decorator editors with CodeMirror
 *
 * @context atl.admin
 */

/*global require */

var $ = require("speakeasy/jquery").jQuery,
    codemirror = require("common/codemirror2");

$(function() {
    console.log("ENHANCE");
    $('form[name="editdecorator"] textarea[name="content"]').each(function() {
        console.log("ME", this);
        codemirror.enhanceTextArea(this, "velocity");
    });
});
