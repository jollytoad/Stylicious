/**
 * Provides the main utility functions for loading, saving and applying style sheets.
 * @public
 */

/*! Copyright 2011 Mark Gibson */

/*global require, exports, localStorage */

var $ = require("speakeasy/jquery").jQuery;


function styleId(type, id) {
    return "stylicious-" + type + "-" + id;
}

function getStyleSheet(type, id) {
    return localStorage.getItem(styleId(type, id));
}

function saveStyleSheet(type, id, content) {
    if (content) {
        localStorage.setItem(styleId(type, id), content);
    } else {
        localStorage.removeItem(styleId(type, id));
    }
}

function injectStyleSheet(sid, content) {
    $("style#" + sid).remove();
    if (content) {
        $("<style/>").attr('id', sid).text(content).appendTo("head");
    }
}

function applyStyleSheet(type, id, content) {
    if (type && id) {
        injectStyleSheet(styleId(type, id), content !== undefined ? content : getStyleSheet(type, id));
    }
}

function forEachStyleSheet(context, fn) {
    function callFn(type, id) {
        if ($.isFunction(id)) {
            id = id();
        }
        if (type && id) {
            fn(type, id);
            return id;
        }
    }

    fn("global", true);

    if (context) {
        if (!callFn("space", context.spaceKey)) {
            fn("nospace", true);
            callFn("dashboard", context.dashboard);
        }
        callFn("page", context.pageId);
    }
}

function applyStyleSheets(context) {
    forEachStyleSheet(context, applyStyleSheet);
}

/**
 * Get a style sheet from localStorage.
 * <code>getStyleSheet(type, id)</code>
 */
exports.getStyleSheet = getStyleSheet;

/**
 * Save a style sheet.
 * <code>saveStyleSheet(type, id, content)</code>
 */
exports.saveStyleSheet = saveStyleSheet;

/**
 * Apply a style sheet to the document, replacing the existing one of the same type/id.
 * <code>applyStyleSheet(type, id, content)</code>
 * if a content param is not given the saved style sheet will be fetched.
 */
exports.applyStyleSheet = applyStyleSheet;

/**
 * Apply all style sheets that are relevant to the current document.
 * <code>applyStyleSheets(context)</code>
 */
exports.applyStyleSheets = applyStyleSheets;

/**
 * Call a function for each style sheet that is relevant to the current document.
 * <code>forEachStyleSheet(context, fn)</code>
 */
exports.forEachStyleSheet = forEachStyleSheet;
