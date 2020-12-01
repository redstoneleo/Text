// ==UserScript==
// @name        New script - baichuanweb.com
// @namespace   Violentmonkey Scripts
// @match       http://www.baichuanweb.com/zyk/quesanswerManage
// @match       https://files.21voa.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 2020/7/16 上午9:33:54
// ==/UserScript==
(function() {//http://www.baichuanweb.com/zyk/quesanswerManage
    'use strict';
    window.onload = function() {
        var intervalID = window.setInterval(function() {//加载结束后，document.querySelector('.task-botton')还没有，所以用计时器延后1s
            var taskBotton =document.querySelector('.task-botton');
            try {
                if (!taskBotton.disabled) {//可以领取；
                    taskBotton.click();//领取
                    //进一步确定
                    document.querySelector('#ask-manage-yzj > div.el-dialog__wrapper.dialog-yzj-normal > div > div.el-dialog__footer > div > button:nth-child(2)').click();//领取的确定按钮
                    var colseBtnHasTask=document.querySelector('body > div.el-dialog__wrapper.dialog-yzj-normal > div > div.el-dialog__footer > div > button')//关闭按钮-------您还有未完成的任务，请完成后再领取！
                    if(colseBtnHasTask){
                      // colseBtnHasTask.click();//继续点击 确定按钮 ，继续刷题-------您还有未完成的任务，请完成后再领取！
                      window.location.reload();//通过刷新网页来跳过这个窗口；上面关闭后会转到“未完成的任务”界面，重新刷新回到原来的界面
                    }else{//领到新题目
                      window.clearInterval(intervalID)//不自动刷新，不添乱
                      console.log('clearInterval');
                      var audioObj = new Audio('https://files.21voa.com/202007/comet-neowise-provides-light-shows-while-passing-by-earth.mp3');
                      audioObj.addEventListener("canplaythrough", event => {
                          /* the audio is now playable; play it if permissions allow */
                          audioObj.play();

                      });
                      setTimeout(function() { window.location.reload();}, 10*1000);//有题的情况下三分钟后重新刷题
                    }  

                } else {//不可以领
                    window.location.reload();
                }
            } catch (e) { //主要是为了防止taskBotton没有disabled的情况导致程序不运行；有时候还是会没有.disabled，因为是null object，
                if (e instanceof TypeError) {
                    // console.log(e);
                }
            }
        }, 1000);
    };


})();