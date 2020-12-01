// ==UserScript==
// @name         取词
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==
(
  function(){
      var styleSheet = document.createElement("style"); 
      styleSheet.type = "text/css"; 
      styleSheet.innerText =`.hypothesis-highlight {background-color: rgba(255, 150, 255, 0.5) !important;}`; 
      document.head.appendChild(styleSheet);
      
      
    window.hypothesisConfig=function(){
      return{showHighlights:true,appType:'bookmarklet'};
    };
    var d=document;
    var s=d.createElement('script');
    s.setAttribute('src','https://hypothes.is/embed.js');
    d.body.appendChild(s);
  }
)();
