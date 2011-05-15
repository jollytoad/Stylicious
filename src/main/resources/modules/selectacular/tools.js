/**
 * Selectacular Tool Registration
 * @public
 */

/*! Copyright 2011 Mark Gibson */

/*global exports */

var tools = {};

function getTool(id) {
    return tools[id];
}

function addTool(id, options) {
    tools[id] = options;
}

function removeTool(id) {
    delete tools[id];
}

function forEachTool(fn) {
    for(var id in tools) {
        if (tools.hasOwnProperty(id)) {
            fn(id, tools[id]);
        }
    }
}

exports.getTool = getTool;
exports.addTool = addTool;
exports.removeTool = removeTool;
exports.forEachTool = forEachTool;
