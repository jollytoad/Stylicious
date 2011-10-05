/**
 * Enhance decorator editors with CodeMirror
 *
 * @context atl.admin
 */

/*global require */

var $ = require("speakeasy/jquery").jQuery,
    codemirror = require("common/codemirror2");

$(function() {
    var form = $('form[name="editdecorator"]');
    $('textarea[name="content"]', form).each(function() {
        codemirror.enhanceTextArea(this, "velocity", function(cm) {
            cm.getWrapperElement();

            var container = $('<div class="codemirror-mode-switch">Highlight mode: </div>').insertBefore(form);

            function addMode(mode, label) {
                var radio = $('<input type="radio" name="codemirror-mode"/>').attr('value', mode);

                $('<label/>').text(label).prepend(radio).appendTo(container);

                radio.bind("click", function() {
                    if (this.checked && cm.getOption("mode") !== this.value) {
                        cm.setOption("mode", this.value);
                    }
                });

                if (cm.getOption("mode") === mode) {
                    radio.attr("checked", true);
                }
            }

            addMode("htmlmixed", "HTML");
            addMode("velocity", "Velocity");
        });
    });
});
