/**
 * Enhance stylesheet editors with CodeMirror
 *
 * @context atl.admin
 */

/*global require */

var $ = require("speakeasy/jquery").jQuery,
    codemirror = require("common/codemirror2");

$(function() {
    $('form[action="doeditstylesheet.action"] textarea[name="style"]').each(function() {
        codemirror.enhanceTextArea(this, "css");
    });
});
