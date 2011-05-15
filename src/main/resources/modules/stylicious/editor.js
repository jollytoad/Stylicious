/**
 * Stylicious Editor
 * @public
 */

/*! Copyright 2011 Mark Gibson */

/*global require, exports, document */

var stylicious = require("stylicious/stylesheets"),
    confluence = require("stylicious/confluence"),
    $ = require("speakeasy/jquery").jQuery,
    AJS = require("common/ajs").AJS,
    optional = require("common/optional").optional;

var types = {
    "global": "Everywhere",
    "nospace": "Global areas",
    "dashboard": "Dashboard only",
    "space": "This space only",
    "page": "This page only"
};

var dialog,
    selector;

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
        this.focus();
        if ('selectionStart' in this) {
            // Most browsers
            var start = this.selectionStart;
            this.value = this.value.slice(0, start) + text + this.value.slice(this.selectionEnd);
            this.selectionStart = start;
            this.selectionEnd = start + text.length;
        } else if (document.selection) {
            // IE
            document.selection.createRange().text = text;
        } else {
            // Unsupported
            this.value += text;
        }
    };
}

function insertSelector() {
    if (dialog && selector) {
        dialog.getCurrentPanel().body.find("textarea.stylicious-editor").each(replaceSelection(selector));
    }
}

function closeEditor() {
    if (dialog) {
        dialog.remove();
        dialog = undefined;
    }
}

function openEditor() {
    dialog = new AJS.Dialog({width:500, height:450, id:"stylicious-dialog"});

    dialog.addHeader("Stylicious");

    function addEditorPanel(type, id) {
        dialog.addPanel(types[type], panelContent(type, id));
    }
    stylicious.forEachStyleSheet(confluence, addEditorPanel);

    if (selector) {
        dialog.addButton("Insert", function(dialog) {
            insertSelector();
        });
    }

    optional("selectacular/selector", function(selectacular) {
        dialog.addButton("Selectacular", function(dialog) {
            dialog.hide();
            selectacular.start();
        });
    });

    dialog.addButton("Apply", function() {
        // Apply style sheets from editors
        forEachEditor(stylicious.applyStyleSheet);
    });
    dialog.addSubmit("Ok", function() {
        // Save style sheets from editors and apply
        forEachEditor(stylicious.saveStyleSheet);
        stylicious.applyStyleSheets(confluence);
        closeEditor();
    });
    dialog.addCancel("Cancel", function() {
        // Reset to saved style sheets
        stylicious.applyStyleSheets(confluence);
        closeEditor();
    });

    dialog.show();
}

function selectacularAction(newSelector) {
    console.log(newSelector);
    selector = newSelector;
    if (dialog) {
        dialog.show();
        insertSelector();
    } else {
        openEditor();
    }
}

exports.openEditor = openEditor;
exports.selectacularAction = selectacularAction;