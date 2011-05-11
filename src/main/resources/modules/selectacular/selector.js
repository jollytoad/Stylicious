/**
 * Selectacular
 * @public
 */

/*! Copyright 2011 Mark Gibson */

/*global require, exports, document, window */

var $ = require("speakeasy/jquery").jQuery,
    AJS = require("stylicious/ajs").AJS,
    ui,
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
        selector += $(this).nextUntil("li:has(.select)").length == 1 ? ' > ' : ' ';
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

    while ( elem ) {
        step = $('<li class="selector"/>');
        tag = elem.nodeName.toLowerCase();

        if ( elem.id ) {
            createSelectorOption('#' + elem.id, 'id').appendTo(step);
        }

        $.each($.trim(elem.className).split(/\s+/), function(i, name) {
            if ( name.length && !/^SELECTACULAR/.test(name) ) {
                createSelectorOption('.' + name, 'class').appendTo(step);
            }
        });

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
    $(selector).not('.SELECTACULAR').addClass('SELECTACULAR-SELECT');
    //updateCSS(this.value);
}

function open() {
    if (!ui) {
        ui = $('<div id="selectacular-ui"><div id="selectacular-path"></div><div id="selectacular-expr"><input type="text"/></div></div>').appendTo("body");

        $("#selectacular-expr > input")
            .bind('change', function() {
                highlightSelection(this.value);
            })
            .bind('keydown', function() {
                var self = this;
                window.clearTimeout(keyTimeout);
                keyTimeout = window.setTimeout(function() {
                    $(self).triggerHandler('change');
                }, 1000);
            });
    }
}

function close() {
    if (ui) {
        ui.remove();
        ui = undefined;
    }
}

function select(target) {
    if (target != selected) {
        $("#selectacular-path").empty().append(createPathFinder(target));
        $("#selectacular-expr > input").val(selectorForElement(target));
        selected = target;
    }
}

function stop() {
    $(document).unbind(".selectacular");
    $(".SELECTACULAR-HOVER").removeClass("SELECTACULAR-HOVER");
}

function freeze(target) {
    stop();
    select(target);
    $("#selectacular-ui, #selectacular-ui *").addClass("SELECTACULAR");
    $("#selectacular-expr > input").trigger('change');
}

function start() {
    console.log("Start Selectacular");

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
}

exports.start = start;
exports.stop = stop;
exports.select = select;
