/**
 * Confluence page info
 * @public
 */

/*global require, exports */

var $ = require("speakeasy/jquery").jQuery,
    AJS = require("stylicious/ajs").AJS;

function dashboard() {
    return $("body").hasClass("dashboard");
}

function spaceKey(defaultSpaceKey) {
    return AJS.params.spaceKey || $("meta#confluence-space-key").attr("content") || defaultSpaceKey;
}

function pageId(defaultPageId) {
    return AJS.params.pageId || defaultPageId;
}

/**
 * Are we on the dashboard page?
 */
exports.dashboard = dashboard;

/**
 * Get the current space key.
 */
exports.spaceKey = spaceKey;

/**
 * Get the id of the current page.
 */
exports.pageId = pageId;
