/**
 * Created by xiao lei on 2016/7/16.
 */
/**
 * bind:解决了DOM2级事件的兼容问题；（除了顺序以外）
 * @param curEle
 * @param eventType
 * @param eventFn
 */
function bind(curEle,eventType,eventFn){
    if('addEventListener' in document){//标准浏览器的支持
        curEle.addEventListener(eventType,eventFn,false);
        return;
    }
    //相当于我们给eventFn这个方法带了黑面具；
    var tmpFn=function(){
        eventFn.call(curEle);//这里主要解决this问题；
    };
    tmpFn.name=eventFn;
    if(!curEle['myBind'+eventType]){//自定义属性不存在的话
        curEle['myBind'+eventType]=[];//创建一个自定义属性做为数组；
    }
    var ary=curEle['myBind'+eventType];//ary是自己的事件池；
        //每次往数组中插入新的匿名函数的时候，我们都会先通过这个匿名函数的名字，判断他是否已经存在，如果存在，不插入，不存在才插入
        for(var i=0; i<ary.length; i++){
            var cur=ary[i];
            if(cur.name===eventFn){//如果数组中如果存在该匿名函数，不做任何操作
                return;//这里主要解决的是重复问题；
            }
    }
    ary.push(tmpFn);//每个被绑定的匿名函数，都存在元素的自定义属性这个数组上；
    //IE浏览器的兼容处理
    curEle.attachEvent('on'+eventType,tmpFn);//把带了黑面具的这个方法，放在系统的事件池中；
}
/**
 * unbind:解除DOM2级事件绑定
 * @param curEle
 * @param eventType
 * @param eventFn
 */
function unbind(curEle,eventType,eventFn){
    if('removeEventListener' in document){//标准浏览器的支持
        curEle.removeEventListener(eventType,eventFn,false);
        return;
    }
    var ary=curEle['myBind'+eventType];
    for(var i=0; i<ary.length; i++){
        var cur=ary[i];
        if(cur.name===eventFn){
            //1.删除自己事件池中的匿名函数--splice
            ary.splice(i,1);
            //2.删掉浏览器事件池中的匿名函数--detachEvent
            curEle.detachEvent('on'+eventType,cur);
            break;
        }
    }

    //IE浏览器的兼容处理
    curEle.detachEvent('on'+eventType,eventFn);
}
function on(curEle,eventType,eventFn){
    //每绑定一次，把eventFn存到一个数组中；数组创建到自定义属性上；
    if(!curEle['myEvent'+eventType]){
        curEle['myEvent'+eventType]=[];
    }
    var ary=curEle['myEvent'+eventType];
    for(var i=0; i<ary.length; i++){
        var cur=ary[i];
        if(cur===eventFn){//重复问题的解决
            return;
        }
    }
    ary.push(eventFn);//完成了自己事件池上某个行为绑定的一系列方法
    bind(curEle,eventType,run);//在系统事件池中，只调用了run;
    //run:把该行为下保存的每个方法都调用；（该行为下保存的每个方法都存储在自定义属性这个数组上）；
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
function run(e){//把自定义属性这个数组中的每一项有顺序的调用；
    //this-->curEle;
    e=e||window.event;
    if(!e.target){
        //低级浏览器对所有不兼容的做兼容处理
        e.target= e.srcElement;//事件源的兼容处理；
        //关于到第一屏可视区左上角的坐标位置；
        e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+ e.clientX;
        e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+ e.clientY;
        //阻止默认事件
        e.preventDefault=function(){
            e.returnValue=false;
        };
        //阻止冒泡
        e.stopPropagation=function(){
            e.cancelBubble=true;
        }

    }
    //把自定义属性这个数组中存的所有方法都执行；
    var ary=this['myEvent'+ e.type];
    for(var i=0; i<ary.length; i++){
        var cur=ary[i];
        cur.call(this,e);//this问题的解决
    }

}
