/**
 * CodeMirror - reused from the SpeakEasy plugin itself
 *
 * @public
 */

/*global require, exports, window */

var $ = require("speakeasy/jquery").jQuery,
    staticResourcesPrefix = require("speakeasy/host").staticResourcesPrefix;

var src = staticResourcesPrefix + '/com.atlassian.labs.speakeasy-plugin:codemirror/js/codemirror.js';

function usingCodeMirror(callback) {
    if ('CodeMirror' in window) {
        callback(window.CodeMirror);
    } else {
        $.getScript(src, function() {
            callback(window.CodeMirror);
        });
    }
}

function enhanceTextArea(textarea) {
    usingCodeMirror(function(CodeMirror) {
        var mirror;

        // Copy font styling from textarea to CodeMirror
        function ready() {
            function getCSS( elem, props ) {
                var css = {};
                $.each(props, function(i, p) {
                    css[p] = elem.css(p);
                });
                return css;
            }

            $('.editbox', mirror.win.document).css(getCSS($(textarea), ['font-family', 'font-size', 'font-style', 'font-variant', 'font-weight', 'line-height']));
        }

        mirror = CodeMirror.fromTextArea(textarea, {
            autoMatchParens: true,
            parserfile: [ "parsecss.js" ],
            stylesheet: [ staticResourcesPrefix + '/com.atlassian.labs.speakeasy-plugin:codemirror/css/csscolors.css' ],
            path: staticResourcesPrefix + '/com.atlassian.labs.speakeasy-plugin:codemirror/js/',
            onLoad: ready
        });

        $(textarea).data('codemirror', mirror);
    });
}

exports.usingCodeMirror = usingCodeMirror;
exports.enhanceTextArea = enhanceTextArea;
