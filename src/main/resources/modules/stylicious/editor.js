/**
 * Stylicious Editor
 * @public
 */

/*! Copyright 2011 Mark Gibson */

/*global require, exports */

var stylicious = require("stylicious/stylesheets"),
    confluence = require("stylicious/confluence"),
    selectacular = require("selectacular/selector"),
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

function replaceSelection(text) {
    return function() {
        if ('selectionStart' in this) {
            // Most browsers
            this.value = this.value.slice(0, this.selectionStart) + text + this.value.slice(this.selectionEnd);
        } else if (document.selection) {
            // IE
            this.focus();
            document.selection.createRange().text = text;
        } else {
            // Unsupported
            this.value += text;
        }
    };
}

function openSelectacular(callback) {
    function insertSelector(event) {
        event.preventDefault();
        var selector = selectacular.selector();
        selectacular.close();
        callback(selector);
    }
    var insertTool = $('<a href="#" title="Insert into Stylicious">$</a>').bind("click", insertSelector);
    selectacular.start().addTool("insert-in-stylicious", insertTool);
}

function openEditor() {
    var dialog = new AJS.Dialog({width:500, height:450, id:"stylicious-dialog"});

    dialog.addHeader("Stylicious");

    function addEditorPanel(type, id) {
        dialog.addPanel(types[type], panelContent(type, id));
    }
    stylicious.forEachStyleSheet(confluence, addEditorPanel);

    dialog.addButton("Selectacular", function(dialog) {
        dialog.hide();
        openSelectacular(function(selector) {
            dialog.show();
            console.log(selector);
            if (selector) {
                dialog.getCurrentPanel().body.find("textarea.stylicious-editor").each(replaceSelection(selector));
            }
        });
    });
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