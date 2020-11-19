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

    // alert('paragraph--------------', paragraph);
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
    
    // socket= new WebSocket('ws://127.0.0.1:8522');//还是要不停创建才行，不然链接会断掉
    // socket.onopen= function() {
    //     socket.send(word);//downloadInfo=={tabId:[resourceUrl,sourceUrl,pageTitle]}
    //     // socket.close();
        
    // };

// D:\BaiduYunDownload\微积分\What is Mathematics\文字ocr精度不高What is Mathematics - 2nd Ed - Richard Courant.pdf
// C:\Users\i\Downloads\The-Design-of-Everyday-Things-Revised-and-Expanded-Edition.pdf


//     elementFromPoint=document.elementFromPoint(event.clientX, event.clientY);//为了可读性，不用rangeStartNode.parentNode了//https://mozilla.github.io/pdf.js/web/viewer.html默认的pdf里，rangeStartNode.previousSibling返回null，所以还是要用parentNode；parentNode返回的是当前行，而该行并不一定是完整的句子
//     elementText=elementFromPoint.textContent;
//     // console.log('elementText---------',elementText);
//     wordStartIndex=elementText.indexOf(word);//对于二次出现的单词会出现单词例句提取的情况，但这很正常，不要怪
// //////////////////开始获取endText,任务：还有一种方法就是单词前后20个单词长度截取
//     textSinceWord=elementText.substring(wordStartIndex);
//     delimiterIndex=textSinceWord.search(sentenceDelimiterPtn);//从单词起始处搜索，减少搜索量
//     if (delimiterIndex!=-1){
//         endText=elementText.substring(wordStartIndex,wordStartIndex+delimiterIndex+1);//+1是为了包含标点符号（比如通过问号可以明辨句式）
//         console.log('尾---第一次---------',endText);
//     }
//     else{
//         endText=textSinceWord;//把elementFromPoint的text暂时作为endText
//         nextSibling=elementFromPoint.nextSibling;//和下面一句不能合并，因为else里要用到nextSibling
//         while(true){
//             if(nextSibling==null){//pdf.js打开按钮会有这种问题
//                 break;
//             }   
//             nextElementText=nextSibling.textContent;
//             delimiterIndex=nextElementText.search(sentenceDelimiterPtn);
//             if (delimiterIndex!=-1){
//                 endText+=' '+nextElementText.substring(0,delimiterIndex+1);//+1是为了包含标点符号（比如通过问号可以明辨句式）
//                 // console.log('endText---------',endText);
//                 break;
//             }
//             else{
//                 endText+=' '+nextElementText;//加个空格，不然会连在一起没有空格
//                 nextSibling=nextSibling.nextSibling;//为了把nextSibling返回上面的循环再用——获取当前nextSibling的nextSibling
//             } 
//         }
//     }
//     console.log('endText---------',endText);
// //////////////////开始获取headText
//     textBeforeWord=elementText.substring(0,wordStartIndex);
//     // console.log('elementText---------',elementText);
//     // console.log('textBeforeWord---------',textBeforeWord);
//     delimiterIndex=textBeforeWord.search(sentenceHeadDelimiterPtn);//从单词起始处搜索，减少搜索量
//     if (delimiterIndex!=-1){
//         headText=elementText.substring(delimiterIndex+2,wordStartIndex);//+1是为了去掉句首的分隔符，再+1去掉界定符后面的空格
//         console.log('头---第一次---------',headText);
//     }
//     else{
//         headText=textBeforeWord;//把elementFromPoint的text暂时作为headText
//         previousSibling=elementFromPoint.previousSibling;
//         while(true){
//             if(previousSibling==null){//段落开头会有这种问题，此时就用上面的headText=textBeforeWord
//                 break;
//             }            
//             previousElementText=previousSibling.textContent;
//             // console.log('previousElementText---------',previousElementText);
//             delimiterIndex=previousElementText.search(sentenceHeadDelimiterPtn);//任务：这里还是要从后面往前追踪，否则可能导致匹配太多text
//             if (delimiterIndex!=-1){
//                 headText=previousElementText.substring(delimiterIndex+2)+' '+headText;//+1是为了去掉句首的分隔符
//                 // console.log('headText---delimiterIndex------',delimiterIndex);
//                 break;
//             }
//             else{
//                 headText=previousElementText+' '+headText;//+1是为了包含标点符号（比如通过问号可以明辨句式）
//                 previousSibling=previousSibling.previousSibling;//为了把previousSibling返回上面的循环再用——获取当前previousSibling的previousSibling
//             } 
//         }
//     }
//     // console.log('headText---------',headText);
//     // sentence=(headText+endText).replace(word,'<b>'+word+'</b>').replace(/- /g,'').replace(/  /g,' ');//上一行的连字符+下一行的空格   去掉吧,.trim();//比如“文字ocr精度不高What is Mathematics - 2nd Ed - Richard Courant.pdf”每个单词后面都有一个空格，所以要替换双空格或提前对每个单词trim--麻烦;replace只能替换目标字符串中第一个匹配的字符串，所以g
//     sentence=(headText+endText).replace(/- /g,'').replace(/  /g,' ');//上一行的连字符+下一行的空格   去掉吧,.trim();//比如“文字ocr精度不高What is Mathematics - 2nd Ed - Richard Courant.pdf”每个单词后面都有一个空格，所以要替换双空格或提前对每个单词trim--麻烦;replace只能替换目标字符串中第一个匹配的字符串，所以g
//     //替换不了所有的单词间的双空格，求解释   'In case  this  product  is  odd,  the  situation  is  reversed,  so  that  p  is  a  residue  of  q  if  and  only  if  q  is  a  non-residue  non-residue  of  p.'.replace('  ','')
//     // console.log('sentence---------',sentence);
//     socket.onopen= function() {//在此不能直接发送，否则Uncaught DOMException: Failed to execute 'send' on 'WebSocket': Still in CONNECTING state.
//         socket.send(word+'■'+sentence);//分两次传是为了不想耽搁前面传单词，为的是立即出现释义
//         // socket.close();
        
//     };

        






    range.detach();//放到最后执行不浪费前面的时间，Releases the Range from use to improve performance.



    // clientX = event.clientX, clientY = event.clientY;//似乎没有检查的必要
    // console.log(clientX,clientY);
    // elem = document.elementFromPoint(clientX, clientY);//似乎没有检查的必要
    // if ([elem.nodeType,rangeStartNode.nodeType].indexOf(Node.ELEMENT_NODE)==-1) {
    //     alert('not ELEMENT_NODE',elem.nodeType);
    //     // Node.TEXT_NODE   1   An Element node such as <p> or <div>.
    //     // Node.ELEMENT_NODE  3   The actual Text of Element or Attr.
    //     // Node.PROCESSING_INSTRUCTION_NODE    7   A ProcessingInstruction of an XML document such as <?xml-stylesheet ... ?> declaration.
    //     // Node.COMMENT_NODE   8   A Comment node.
    //     // Node.DOCUMENT_NODE  9   A Document node.
    //     // Node.DOCUMENT_TYPE_NODE 10  A DocumentType node e.g. <!DOCTYPE html> for HTML5 documents.
    //     // Node.DOCUMENT_FRAGMENT_NODE 11  A DocumentFragment node.
    // }
    //   str=elem.innerHTML;
    //   console.log("<span>$1</span>----------------",str);







      
// var wordPtn = /([a-z-\']+)/gi; //\\S点击中文出问题
// var whitespacePtn = /\\s/g; //\\S点击中文出问题 ​

//     // var newstr = str.match(wordPtn);//
//     proText = str.replace(wordPtn, "<span>$1</span>");
//     // console.log('str--------------',str);
//     // console.log('proText--------------',proText);
//     elem.innerHTML=proText;
//       elem = document.elementFromPoint(clientX,clientY);

//       console.log("<span>$1</span>----------------",elem.innerHTML);

}
})();
