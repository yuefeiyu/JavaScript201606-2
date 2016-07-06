/**
 * Created by xiao lei on 2016/7/6.
 */
//1.获取并解析数据 2.绑定数据 3.延迟加载 4.图片自动轮播 5.焦点自动轮播 6.移入移出 7.点击焦点手动切换 8.点击左右按钮切换
(function(){
    var oBox=document.getElementById('box');
    var oBoxInner=oBox.getElementsByTagName('div')[0];
    var oUl=oBox.getElementsByTagName('ul')[0];
    var aDiv=oBoxInner.getElementsByTagName('div');
    var aImg=oBoxInner.getElementsByTagName('img');
    var aLi=oBox.getElementsByTagName('li');
    var aA=oBox.getElementsByTagName('a');
    var data=null;
    var step=0;
    var autoTimer=null;
    var interval=1000;
    //1.获取并解析数据
    getData();
    function getData(){
        var xml=new XMLHttpRequest;
        xml.open('get','json/data.txt?='+Math.random(),false);
        xml.onreadystatechange=function(){
            if(xml.readyState===4 && /^2\d{2}$/.test(xml.status)){
                data=utils.jsonParse(xml.responseText);
            }
        };
        xml.send();
    }
    //2.绑定数据
    bind();
    function bind(){
        var str1='';//根据数据多少，进行字符串拼接div
        var str2='';//根据数据多少，拼接li;
        for(var i=0; i<data.length; i++){
            str1+='<div><img realImg="'+data[i].imgSrc+'" alt=""/></div>';
            str2+=i===0?'<li class="bg"></li>':'<li></li>';
        }
        //给str1再多拼接一个div索引为0的那一项；
        str1+='<div><img realImg="'+data[0].imgSrc+'" alt=""/></div>';
        oBoxInner.innerHTML=str1;
        oUl.innerHTML=str2;
        //改变oBoxInner的宽度；
        oBoxInner.style.width=aDiv.length*aDiv[0].offsetWidth+'px';
    }
    //3.lazyImg 图片延迟加载；
    setTimeout(lazyImg,300)
    function lazyImg(){
        for(var i=0; i<aImg.length; i++){
            //思路1：自定义属性避免异步中的i值问题
            /*var tmpImg=new Image;
            tmpImg.src=aImg[i].getAttribute('realImg');
            tmpImg.index=i;
            tmpImg.onload=function(){//onload事件是个异步，里面的i值一定会出问题
                aImg[this.index].src=this.src;
            }*/
            //思路2：用闭包避免异步中的i值问题
            (function(index){
                var tmpImg=new Image;
                tmpImg.src=aImg[index].getAttribute('realImg');
                tmpImg.onload=function(){
                    aImg[index].src=this.src;
                    tmpImg=null;
                };
                tmpImg.onerror=function(){
                    tmpImg=null;
                }
            })(i);
        }
    }
    //4.图片自动轮播
    clearInterval(autoTimer);
    autoTimer=setInterval(autoMove,interval);
    function autoMove(){
        if(step>=aDiv.length-1){
            step=0;
            utils.css(oBoxInner,'left',0);
        }
        step++;
        zhufengAnimate(oBoxInner,{left:-step*1000},500);
        bannerTip();
    }
    //5.焦点自动轮播
    function bannerTip(){
        var tmpStep=step>=aLi.length?0:step;
        for(var i=0; i<aLi.length; i++){
            i===tmpStep?utils.addClass(aLi[i],'bg'):utils.removeClass(aLi[i],'bg');
        }
    }
    //6.移入移出
    oBox.onmouseover=function(){
        clearInterval(autoTimer);
        aA[0].style.display=aA[1].style.display='block';
    };
    oBox.onmouseout=function(){
        autoTimer=setInterval(autoMove,interval)
        aA[0].style.display=aA[1].style.display='none';
    };
    //7.点击焦点手动切换
    handleChange();
    function handleChange(){
        for(var i=0; i<aLi.length; i++){
            aLi[i].index=i;
            aLi[i].onclick=function(){
                step=this.index;
                zhufengAnimate(oBoxInner,{left:-step*1000},500);
                bannerTip();
            }
        }
    }
    //8.点击左右按钮切换
    aA[1].onclick=autoMove;
    aA[0].onclick=function(){
        if(step<=0){
            step=aLi.length;
            utils.css(oBoxInner,'left',-step*1000);
        }
        step--;
        zhufengAnimate(oBoxInner,{left:-step*1000},500);
        bannerTip();
    }
})();









