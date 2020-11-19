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

  try {
    
var englishWordPtn = new RegExp("[a-z-']+",'i');//i  Case-insensitive search.
var wordFirstPartPtn = new RegExp("[a-z-']+$",'i')
var nonEnglishCharacterPtn = new RegExp("[^a-z-']",'i');//i  Case-insensitive search.

var sentenceDelimiterPtn = new RegExp('[.?!;:]');//句号，问号，感叹号，分号...、：
var sentenceHeadDelimiterPtn = new RegExp('[.?!;:][^.?!;:]*$');//$起到match end的作用，否则search会搜索到first match
var drag = false;

document.addEventListener("mousedown", function(event) {
    drag = false;
    // console.log("mousedown---drag-------",drag);
});
var mouseEvent = null;
document.addEventListener("mousemove", function(event) {//只能通過這種方式獲取光標位置,因為鏈接上的文字不能用點擊來獲取;移动过就算是拖拽了，不管是否按住鼠标左键
    mouseEvent=event;
    drag = true;
    // cursorX =event.clientX
    // cursorY=event.clientY
    // console.log("mousedown----------",cursorX, cursorY);
    // console.log("mousemove---drag-------",drag);
});
document.addEventListener("click", function(event) {//用mousedown不起作用于https://en.oxforddictionaries.com/definition/metaphysics
     // console.log("mousedown----------",event);
    if (event.button == 0) {//&&(drag == false)   只有左键才开工，去掉右键复制的方式获取单词——右键的时候免打扰，;0: Main button pressed, usually the left button or the un-initialized state
        textAtPosition(mouseEvent);
        // console.log("left click");
        // return
    }   
    // console.log("not left click",event.button,drag);
    
});


document.addEventListener("keydown", function(event) {//用keydown也可以防止Auto-repeat
    // console.log('keypress---------',event.key);
    if (event.key=='Shift'){
        textAtPosition(mouseEvent);
    }
});


function textAtPosition(event) {
    // console.log('event.clientX, event.clientY--------------',event.clientX, event.clientY);
    var range = document.caretRangeFromPoint(event.clientX, event.clientY);
    // console.log('range--------------', range);
    var caretPos = range.startOffset; //光标在char上面的时候返回当前字符左侧的位置，在段落开头及其起始字母上的时候返回0
    var rangeStartNode = range.startContainer;//因为是点译，所以startContainer和endContainer重合
    // console.log('rangeStartNode related Node--------------',rangeStartNode.previousSibling,rangeStartNode.nextSibling);//,rangeStartNode,
    var paragraph = rangeStartNode.textContent;

    alert('paragraph--------------');
    // console.log('caretPos--------------',caretPos,paragraph.substring(caretPos));
    if (paragraph.substring(caretPos,caretPos+1).match(nonEnglishCharacterPtn)){//非英语单词
        console.log('非英语单词--------------', '非英语单词');
        return
    }
    // wordBeginPos = whitespacePosBeforeWord = paragraph.lastIndexOf(' ', caretPos)//寻求单词前的空格位置，这种方式取willianm于【威廉（William of Occam）】会得到----》（William，不太好
    // if (wordBeginPos > 0) {
    //     wordBeginPos += 1 //+1是为了去掉空格
    // } 
    // else { //<=0 ，找不到时-1，在段落开头及其起始字母上的时候 //对于后面的substring，If either argument is less than 0 or is NaN, it is treated as if it were 0.
    //     wordBeginPos = 0
    // }
    // wordEndPos = paragraph.indexOf(' ', caretPos)//寻求单词后的空格位置,会包含单词后面的标点符号，所以注释掉不完美不用
    // if (wordEndPos == -1) { //末尾时找不到
    //     wordEndPos = paragraph.length
    //     console.log('wordEndPos from -1 to--------------', wordEndPos);
    // }
    // word=paragraph.substring(wordBeginPos, wordEndPos)

    var wordFirstPart=paragraph.substring(0,caretPos).match(wordFirstPartPtn)[0];
    var wordLastPart=paragraph.substring(caretPos).match(englishWordPtn)[0];
    var word=wordFirstPart+wordLastPart;
    // console.log('wordFirstPart--------------',wordFirstPart);
    // console.log('word--------------', word);
    
    alert(word);


//     window.open(`eudic://peek/${word}`);
    window.location.href=`eudic://peek/${word}`;
    
    range.detach();//放到最后执行不浪费前面的时间，Releases the Range from use to improve performance.


}
    
 } catch (e) { //主要是为了防止taskBotton没有disabled的情况导致程序不运行；有时候还是会没有.disabled，因为是null object，
               alert(e);
            }   
    
})();
