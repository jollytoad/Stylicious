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
var cssThemes = cmResources + 'codemirror2-themes.css';

function linkStylesheet(href, id) {
    $('<link type="text/css" rel="stylesheet"/>').attr({ id: id, href: href }).appendTo("head");
}

function usingCodeMirror(callback) {
    if ('CodeMirror' in window) {
        callback(window.CodeMirror);
    } else {
        $.getScript(src, function() {
            callback(window.CodeMirror);
        });
        linkStylesheet(css);
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

function switcher(cm, name, label, type) {
    var container = $('<div/>').text(label).attr('class', 'codemirror-switch-'+name),
        select;

    function addRadio(value, label) {
        var radio = $('<input type="radio"/>').attr({ name: 'codemirror-switch-'+name, value: value });

        $('<label/>').text(label).prepend(radio).appendTo(container);

        radio.bind("click", function() {
            if (this.checked && cm.getOption(name) !== this.value) {
                cm.setOption(name, this.value);
            }
        });

        if (cm.getOption(name) === value) {
            radio.attr("checked", true);
        }

        return this;
    }

    function addOption(value, label) {
        var option = $('<option/>').attr('value', value).text(label).appendTo(select);
        if (cm.getOption(name) === value) {
            option.attr("selected", true);
        }
        return this;
    }

    switch(type) {
        case 'radio':
            container.addOption = addRadio;
            break;
        case 'select':
            container.addOption = addOption;
            select = $("<select/>").attr('name', 'codemirror-switch-'+name).appendTo(container).bind('change', function() {
                var value = $(this).val();
                if (cm.getOption(name) !== value) {
                    cm.setOption(name, value);
                }
            });
            break;
    }

    return container;
}

function themeSwitcher(cm) {
    linkStylesheet(cssThemes);
    return switcher(cm, "theme", "Theme", "select")
            .addOption("default", "Default")
            .addOption("cobalt", "Cobalt")
            .addOption("eclipse", "Eclipse")
            .addOption("elegant", "Elegant")
            .addOption("neat", "Neat")
            .addOption("night", "Night");
}

exports.usingCodeMirror = usingCodeMirror;
exports.enhanceTextArea = enhanceTextArea;
exports.switcher = switcher;
exports.themeSwitcher = themeSwitcher;