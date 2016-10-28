// ==UserScript==
// @name         CodeHS Pass Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://codehs.com/editor/*grade_mode=my_queue
// @grant        none
// ==/UserScript==


var helpTab = `
    $("#review-work").trigger("click");
    $("#run-tab-container").removeClass("active");
    $("#help-tab-container").addClass("active");
    $("#run-tab").removeClass("active");
    $("#help-tab").addClass("active");
`;

(function() {
    'use strict';

    $( ".run_code" ).parent().append("<span class='button btn-main-green' onclick='$(\"#review-pass\").trigger(\"click\");$(\"#ask_question\").trigger(\"click\");'>Pass</span>");
    $( ".run_code" ).parent().append("<span class='button btn-main-red' onclick='" + helpTab + "'>Needs Work</span>");

})();
