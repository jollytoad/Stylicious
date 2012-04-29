/**
 * Selectacular
 * @public
 */

/*! Copyright 2011 Mark Gibson */

/*global require, exports, document, window */

var $ = require("speakeasy/jquery").jQuery,
    AJS = require("common/ajs").AJS,
    tools = require("selectacular/tools"),
    selectacular = exports;

var ui,
    selected,
    keyTimeout,
    selectTimeout;

function toggleSelectorOption(event) {
    var selector = '';

    $(this).toggleClass('select');

    function add() {
        selector += $(this).text();
    }

    $('#selectacular-path li:has(.select)').each(function() {
        $('.tag.select', this).each(add);
        $('.id.select', this).each(add);
        $('.class.select', this).each(add);
        selector += $(this).nextUntil("li:has(.select)").length === 1 ? ' > ' : ' ';
    });

    $('#selectacular-expr > input').val(selector).trigger('change');

    return false;
}

function createSelectorOption( selector, type ) {
    return $('<div class="option"/>')
        .addClass(type)
        .text(selector)
        .bind('click', toggleSelectorOption);
}

// Generate a selector expression to uniquely select the given element
function selectorForElement( elem ) {
    var sel = [],
        pos, before, after;

    while (elem) {
        if ( elem.id ) {
            sel.unshift('#' + elem.id);
            break;
        }

        if ( $(elem).is('body, html') ) {
            sel.unshift(elem.nodeName.toLowerCase());
            break;
        }

        // Find the position of elem within its parent
        pos = $(elem).prevAll(elem.nodeName).size();
        pos = pos ?
            ( !$(elem).nextAll(elem.nodeName).size() ? ':last' : ':nth(' + pos + ')' ) :
            ':first';

        sel.unshift(elem.nodeName.toLowerCase() + pos);
        sel.unshift('>');

        elem = elem.parentNode;
    }

    return sel.join(' ');
}

// Generate possible selectors for the given element
function createPathFinder( elem ) {
    var path = $('<ol/>'),
        step, tag, pos;

    function addClassOption(i, name) {
        if ( name.length && !/^SELECTACULAR/.test(name) ) {
            createSelectorOption('.' + name, 'class').appendTo(step);
        }
    }

    while ( elem ) {
        step = $('<li class="selector"/>');
        tag = elem.nodeName.toLowerCase();

        if ( elem.id ) {
            createSelectorOption('#' + elem.id, 'id').appendTo(step);
        }

        $.each($.trim(elem.className).split(/\s+/), addClassOption);

        createSelectorOption(tag, 'tag').appendTo(step);

        path.prepend(step);

        if ( tag === 'body' ) {
            elem = null;
        } else {
            path.prepend('<li class="combinator">&gt;</li>');
            elem = elem.parentNode;
        }
    }

    return path;
}

function highlightSelection(selector) {
    $(".SELECTACULAR-SELECT").removeClass('SELECTACULAR-SELECT');
    if (selector) {
        $(selector).not('.SELECTACULAR').addClass('SELECTACULAR-SELECT');
    }
}

function updateTools(selector) {
    $("#selectacular-tools .selectacular-tool.required").toggleClass("disabled", !selector);
}

function selector() {
    return $("#selectacular-expr > input").val();
}

function close() {
    highlightSelection();
    if (ui) {
        ui.remove();
        ui = undefined;
    }
}

function toolAction(id, selector, event) {
    var options = tools.getTool(id);
    if (options && (options.required ? !!selector : true)) {
        var closeAfter = options.close;

        if (options.handler) {
            event.selector = selector;
            options.handler(event, selectacular);
        } else {
            event.preventDefault();
        }

        if (options.action) {
            options.action(selector);
        }

        if (closeAfter) {
            close();
        }
    }
}

function createTool(id, options) {
    return $('<a/>', {
        href: "#",
        "class": "selectacular-tool" + (options.required ? " required" : ""),
        id: "selectacular-tool-" + id,
        title: options.desc,
        text: options.label,
        click: function(event) {
            toolAction(id, selector(), event);
        }
    });
}

function selectorbar() {
    var inputbar = $('<div id="selectacular-expr"/>').appendTo("#selectacular-ui");

    $('<input type="text"/>')
        .bind('change', function() {
            highlightSelection(this.value);
            updateTools(this.value);
        })
        .bind('keydown', function() {
            var self = this;
            window.clearTimeout(keyTimeout);
            keyTimeout = window.setTimeout(function() {
                $(self).triggerHandler('change');
            }, 1000);
        })
        .appendTo(inputbar);
}

function toolbar() {
    var bar = $('<div id="selectacular-tools"/>').appendTo("#selectacular-ui");

    tools.forEachTool(function(id, options) {
        createTool(id, options).appendTo(bar);
    });
}

function open() {
    if (!ui) {
        ui = $('<div id="selectacular-ui" class="bottom left"/>')
                .append($('<div id="selectacular-path"/>'))
                .appendTo("body");

        ui.bind("mouseenter.selectacular-clash", function(event) {
            var ui = $(this);
            if (ui.is(".bottom.left")) {
                ui.removeClass("bottom").addClass("top");
            } else if (ui.is(".top.left")) {
                ui.removeClass("left").addClass("right");
            } else if (ui.is(".top.right")) {
                ui.removeClass("top").addClass("bottom");
            } else if (ui.is(".bottom.right")) {
                ui.removeClass("right").addClass("left");
            }
        });
    }
}

function select(target) {
    if (target !== selected) {
        $("#selectacular-path").empty().append(createPathFinder(target));
//        $("#selectacular-expr > input").val(selectorForElement(target));
        selected = target;
    }
    return exports;
}

function stop() {
    $(document).unbind(".selectacular");
    $(".SELECTACULAR-HOVER").removeClass("SELECTACULAR-HOVER");
}

function freeze(target) {
    stop();
    selectorbar();
    toolbar();
    select(target);
    $("#selectacular-ui").unbind("mouseenter.selectacular-clash").addClass("selectacular-freeze");
    $("#selectacular-ui, #selectacular-ui *").addClass("SELECTACULAR");
    $("#selectacular-expr > input").trigger('change');
}

function start() {
    open();

    $(document)
        .bind("mouseover.selectacular", function(event) {
            window.clearTimeout(selectTimeout);
            selectTimeout = window.setTimeout(function() {
                $(event.target).addClass("SELECTACULAR-HOVER");
                select(event.target);
            }, 100);
        })
        .bind("mouseout.selectacular", function(event) {
            window.clearTimeout(selectTimeout);
            $(event.target).removeClass("SELECTACULAR-HOVER");
        })
        .bind("mousedown.selectacular", function(event) {
            window.clearTimeout(selectTimeout);
            window.setTimeout(function() {
                freeze(event.target);
            }, 0);
            return false;
        })
        .bind("mouseup.selectacular click.selectacular", function() {
            return false;
        });

    return exports;
}

tools.addTool("close-selectacular", {
    label: "x",
    desc: "Close Selectacular",
    close: true
});

$.extend(exports, tools);

exports.start = start;
exports.stop = stop;
exports.open = open;
exports.close = close;
exports.select = select;
