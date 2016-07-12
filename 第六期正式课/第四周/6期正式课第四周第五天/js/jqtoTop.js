/**
 * Created by xiao lei on 2016/7/8.
 */
$(function(){
    var $win=$(window);
    var timer=null;
    //当滚动条滚动的距离大于可视区的时候，让按钮显示，否则隐藏
    $(window).on('scroll',computedDisplay);
    function computedDisplay(){
        //$win.height()->代表clientHeight
        if($win.scrollTop()>$win.height()){
            $('div').stop().show();
        }else{
            $('div').stop().hide();
        }
    }
    //点击按钮，回到顶部
    $('div').click(function(){
        $(this).hide();
        $(window).off('scroll');
        var target=$win.scrollTop();
        var duration=1000;
        var interval=30;
        var step=target/duration*interval;
        timer=setInterval(function(){
            target-=step;
            if(target<=0){
                clearInterval(timer);
                $(window).on('scroll',computedDisplay);
                return;
            }
            $win.scrollTop(target);
        },interval)
    })
})