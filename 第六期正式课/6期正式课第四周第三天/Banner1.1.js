/**
 * Created by xiao lei on 2016/7/6.
 */
function Banner(idName,ajaxUrl,interval,effect){
    this.oBox=document.getElementById(idName);
    this.oBoxInner=this.oBox.getElementsByTagName('div')[0];
    this.oUl=this.oBox.getElementsByTagName('ul')[0];
    this.aDiv=this.oBoxInner.getElementsByTagName('div');
    this.aImg=this.oBoxInner.getElementsByTagName('img');
    this.aLi=this.oBox.getElementsByTagName('li');
    this.aA=this.oBox.getElementsByTagName('a');
    this.data=null;
    this.step=0;
    this.autoTimer=null;
    this.interval=interval||1000;
    this.ajaxUrl=ajaxUrl;
    this.myEffect=effect||0;
    this.init();
}
Banner.prototype={
    constructor:Banner,
    init:function init(){
        var _this=this;//把实例this保存到_this中；
        this.getData();//1.获取数据
        this.bind();//2.绑定数据
        setTimeout(function(){//3.延迟加载图片
            _this.lazyImg();
        },300);
        //4.图片自动轮播
        clearInterval(this.autoTimer);//开启定时器前先关闭定时器
        this.autoTimer=setInterval(function(){//开启定时器，让图片自动轮播
            _this.autoMove();
        },this.interval);
        //6.移入移出
        this.overOut();
        //7.手动切换
        this.handleChange();
        //8.左右切换
        this.leftRight();
    },
    getData:function getData(){
        var _this=this;//把实例this保存在_this;
        var xml=new XMLHttpRequest;
        xml.open('get',this.ajaxUrl+'?='+Math.random(),false);
        xml.onreadystatechange=function(){
            if(xml.readyState===4 && /^2\d{2}$/.test(xml.status)){
                _this.data=utils.jsonParse(xml.responseText);
            }
        };
        xml.send();
    },
    bind:function bind(){
        var str1='';//根据数据多少，进行字符串拼接div
        var str2='';//根据数据多少，拼接li;
        for(var i=0; i<this.data.length; i++){
            str1+='<div><img realImg="'+this.data[i].imgSrc+'" alt=""/></div>';
            str2+=i===0?'<li class="bg"></li>':'<li></li>';
        }
        //给str1再多拼接一个div索引为0的那一项；
        str1+='<div><img realImg="'+this.data[0].imgSrc+'" alt=""/></div>';
        this.oBoxInner.innerHTML=str1;
        this.oUl.innerHTML=str2;
        //改变oBoxInner的宽度；
        this.oBoxInner.style.width=this.aDiv.length*this.aDiv[0].offsetWidth+'px';
    },
    lazyImg:function lazyImg(){
        var _this=this;
        for(var i=0; i<this.aImg.length; i++){
            //思路2：用闭包避免异步中的i值问题
            (function(index){
                var tmpImg=new Image;
                tmpImg.src=_this.aImg[index].getAttribute('realImg');
                tmpImg.onload=function(){
                    _this.aImg[index].src=this.src;
                    tmpImg=null;
                };
                tmpImg.onerror=function(){
                    tmpImg=null;
                }
            })(i);
        }
    },
    autoMove:function autoMove(){
        if(this.step>=this.aDiv.length-1){
            this.step=0;
            utils.css(this.oBoxInner,'left',0);
        }
        this.step++;
        zhufengAnimate(this.oBoxInner,{left:-this.step*1000},500,this.myEffect);
        this.bannerTip();
    },
    bannerTip:function bannerTip(){
        var tmpStep=this.step>=this.aLi.length?0:this.step;
        for(var i=0; i<this.aLi.length; i++){
            i===tmpStep?utils.addClass(this.aLi[i],'bg'):utils.removeClass(this.aLi[i],'bg');
        }
    },
    overOut:function(){
        var _this=this;
        _this.oBox.onmouseover=function(){
            clearInterval(_this.autoTimer);
            _this.aA[0].style.display=_this.aA[1].style.display='block';
        };
        _this.oBox.onmouseout=function(){
            _this.autoTimer=setInterval(function(){
                _this.autoMove();
            },_this.interval)
            _this.aA[0].style.display=_this.aA[1].style.display='none';
        };
    },
    handleChange:function handleChange(){
        var _this=this;
        for(var i=0; i<_this.aLi.length; i++){
            _this.aLi[i].index=i;
            _this.aLi[i].onclick=function(){
                _this.step=this.index;
                zhufengAnimate(_this.oBoxInner,{left:-_this.step*1000},500);
                _this.bannerTip();
            }
        }
    },
    leftRight:function(){
        var _this=this;
        _this.aA[1].onclick=function(){
            _this.autoMove();
        };
        _this.aA[0].onclick=function(){
            if(_this.step<=0){
                _this.step=_this.aLi.length;
                utils.css(_this.oBoxInner,'left',-_this.step*1000);
            }
            _this.step--;
            zhufengAnimate(_this.oBoxInner,{left:-_this.step*1000},500);
            _this.bannerTip();
        }
    }



}