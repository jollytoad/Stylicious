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

function enhanceTextArea(textarea, mode, callback) {
    usingCodeMirror(function(CodeMirror) {
        var $textarea = $(textarea),
            mirror;

        function getCSS() {
            var css = {};
            $.each(arguments, function(i, p) {
                css[p] = $textarea.css(p);
            });
            return css;
        }

        var wrapperCSS = getCSS('font-family', 'font-size', 'font-style', 'font-variant', 'font-weight', 'line-height', 'color'),
            scrollerCSS = getCSS('width', 'height');

        mirror = CodeMirror.fromTextArea(textarea, {
            mode: mode,
            indentUnit: 4,
            tabMode: 'shift',
            enterMode: 'keep'
        });

        $(mirror.getWrapperElement()).css(wrapperCSS);
        $(mirror.getScrollerElement()).css(scrollerCSS);
        mirror.refresh();
        
        $(textarea).data('codemirror', mirror);

        if ($.isFunction(callback)) {
            callback(mirror);
        }
    });
}

exports.usingCodeMirror = usingCodeMirror;
exports.enhanceTextArea = enhanceTextArea;
