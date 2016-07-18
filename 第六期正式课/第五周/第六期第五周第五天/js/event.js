/**
 * Created by xiao lei on 2016/7/17.
 */
function bind(curEle,eventType,eventFn){
    if('addEventListener' in document){
        curEle.addEventListener(eventType,eventFn,false);
        return;
    }
    var tmpFn=function(){
        eventFn.call(curEle);
    };
    tmpFn.name=eventFn;
    if(!curEle['myBind'+eventType]){
        curEle['myBind'+eventType]=[];
    }
    var ary=curEle['myBind'+eventType];
    for(var i=0; i<ary.length; i++){
        var cur=ary[i];
        if(cur.name===eventFn){
            return;
        }
    }
    ary.push(tmpFn);//给自己的事件池加方法
    curEle.attachEvent('on'+eventType,tmpFn);//给系统的事件池加方法；
}
function unbind(curEle,eventType,eventFn){
    if('removeEventListener' in document){
        curEle.removeEventListener(eventType,eventFn,false);
        return;
    }
    var ary=curEle['myBind'+eventType];
    for(var i=0; i<ary.length; i++){
        var cur=ary[i];
        if(cur.name===eventFn){
            curEle.detachEvent('on'+eventType,cur);//解除系统事件池
            ary.splice(i,1);//删除自己事件池中的方法；
            break;
        }
    }
}

function on(curEle,eventType,eventFn){
    if(!curEle['myEvent'+eventType]){
        curEle['myEvent'+eventType]=[];
    }
    var ary=curEle['myEvent'+eventType];
    for(var i=0; i<ary.length; i++){
        var cur=ary[i];
        if(cur===eventFn){
            return;
        }
    }
    ary.push(eventFn);//把每次分类保存的方法，都放在自己的事件池；
    bind(curEle,eventType,run);
}
function off(curEle,eventType,eventFn){
    var ary=curEle['myEvent'+eventType];
    for(var i=0; i<ary.length; i++){
        var cur=ary[i];
        if(cur===eventFn){
            ary.splice(i,1);
            break;
        }
    }
}
function run(e){
    //this->curEle
    e=e||window.event;
    if(!e.target){//IE的兼容处理
        e.target= e.srcElement;
        e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+ e.clientX;
        e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+ e.clientY;
        e.preventDefault=function(){
            e.returnValue=false;
        };
        e.stopPropagation=function(){
            e.cancelBubble=true;
        };
    }
    var ary=this['myEvent'+ e.type];
    for(var i=0; i<ary.length; i++){
        var cur=ary[i];
        cur.call(this,e);
    }
}











