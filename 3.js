// ==UserScript==
// @name         取词
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

     document.onclick = function() {
window.open("eudic://dict/word");//,"_blank"
};   
    
})();
