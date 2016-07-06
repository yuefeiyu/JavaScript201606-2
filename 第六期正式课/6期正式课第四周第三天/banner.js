/**
 * Created by xiao lei on 2016/7/6.
 */
(function(){
    var oBox=document.getElementById('box');
    var oBoxInner=oBox.getElementsByTagName('div')[0];
    var aDiv=oBoxInner.getElementsByTagName('div');
    var aImg=oBoxInner.getElementsByTagName('img');
    var aLi=oBox.getElementsByTagName('li');
    var aA=oBox.getElementsByTagName('a');
    oBoxInner.innerHTML+='<div><img src="img/banner1.jpg" alt=""/></div>';
    oBoxInner.style.width=aDiv.length*aDiv[0].offsetWidth+'px';
    var count=aDiv.length;
    var step=0;
    var interval=1000;
    var autoTimer=null;
    //1.图片自动轮播
    clearInterval(autoTimer)
    autoTimer=setInterval(autoMove,interval);
    function autoMove(){
        if(step>=count-1){
            step=0;
            utils.css(oBoxInner,'left',0);
        }
        step++;
        zhufengAnimate(oBoxInner,{left:-step*1000},500);
        bannerTip();
    }
    //2.焦点轮播
    function bannerTip(){
        var tmpStep=step>=aLi.length?0:step;
        for(var i=0; i<aLi.length; i++){
            var curEle=aLi[i];
            i===tmpStep?utils.addClass(curEle,'bg'):utils.removeClass(curEle,'bg');
        }
    }
    //3.鼠标移入停止运动，移出继续运动
    oBox.onmouseover=function(){
        clearInterval(autoTimer);
        aA[0].style.display=aA[1].style.display='block';
    };
    oBox.onmouseout=function(){
        autoTimer=setInterval(autoMove,interval);
        aA[0].style.display=aA[1].style.display='none';
    };
    //4.点击焦点手动切换
    //handleChange();
    (function(){
        for(var i=0; i<aLi.length; i++){
            aLi[i].index=i;
            aLi[i].onclick=function(){
                step=this.index;
                zhufengAnimate(oBoxInner,{left:-step*1000},500);
                bannerTip();
            }
        }
    })();
    //5.点击左右按钮切换
    aA[0].onclick=function(){
        if(step<=0){
            step=count-1;
            utils.css(oBoxInner,'left',-step*1000);
        }
        step--;
        zhufengAnimate(oBoxInner,{left:-step*1000},500);
        bannerTip();
    }
    aA[1].onclick=autoMove;









})();