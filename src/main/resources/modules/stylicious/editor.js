/**
 * Stylicious Editor
 * @public
 */

/*! Copyright 2011 Mark Gibson */

/*global require, exports */

var stylicious = require("stylicious/stylesheets"),
    confluence = require("stylicious/confluence"),
    $ = require("speakeasy/jquery").jQuery,
    AJS = require("stylicious/ajs").AJS;

var types = {
    "global": "Everywhere",
    "nospace": "Global areas",
    "dashboard": "Dashboard only",
    "space": "This space only",
    "page": "This page only"
};

function forEachEditor(styleSheetFn) {
    $("textarea.stylicious-editor").each(function() {
        var editor = $(this);
        styleSheetFn(editor.attr("data-type"), editor.attr("data-id"), editor.val());
    });
}

function panelContent(type, id) {
    return $('<textarea/>', { rows: 20, cols: 40, 'class': "stylicious-editor", 'data-type': type, 'data-id': id,
        val: stylicious.getStyleSheet(type, id)});
}

function openEditor() {
    var dialog = new AJS.Dialog({width:500, height:450, id:"stylicious-dialog"});

    dialog.addHeader("Stylicious");

    function addEditorPanel(type, id) {
        dialog.addPanel(types[type], panelContent(type, id));
    }
    stylicious.forEachStyleSheet(confluence, addEditorPanel);

    dialog.addButton("Apply", function() {
        // Apply style sheets from editors
        forEachEditor(stylicious.applyStyleSheet);
    });
    dialog.addSubmit("Ok", function(dialog) {
        // Save style sheets from editors and apply
        forEachEditor(stylicious.saveStyleSheet);
        stylicious.applyStyleSheets(confluence);
        dialog.remove();
    });
    dialog.addCancel("Cancel", function(dialog) {
        // Reset to saved style sheets
        stylicious.applyStyleSheets(confluence);
        dialog.remove();
    });

    dialog.show();
}

exports.openEditor = openEditor;