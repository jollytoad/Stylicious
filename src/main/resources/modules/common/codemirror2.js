/**
 * CodeMirror2 - included within this plugin
 *
 * @public
 */

/*global require, exports, window */

var $ = require("speakeasy/jquery").jQuery,
    staticResourcesPrefix = require("speakeasy/host").staticResourcesPrefix;

var cmResources = staticResourcesPrefix.replace('resources', 'batch') + '/jollytoad.speakeasy.stylicious:codemirror2/jollytoad.speakeasy.stylicious:';
var src = cmResources + 'codemirror2.js';
var css = cmResources + 'codemirror2.css';

function usingCodeMirror(callback) {
    if ('CodeMirror' in window) {
        callback(window.CodeMirror);
    } else {
        $.getScript(src, function() {
            callback(window.CodeMirror);
        });
        $('<link type="text/css" rel="stylesheet"/>').attr("href", css).appendTo("head");
    }
}

function enhanceTextArea(textarea, mode) {
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
            mode: mode
        });

        $(textarea).data('codemirror', mirror);
    });
}

exports.usingCodeMirror = usingCodeMirror;
exports.enhanceTextArea = enhanceTextArea;
