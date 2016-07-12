/**
 * Created by xiao lei on 2016/7/8.
 */
$.fn.extend({
    tab:tab
});
function tab(){//需求:把对象this===$('#box1')变成字符串'#box1'
    //console.log(this)-->打印出来的是jquery元素的样子
    var id='#'+this.attr('id');//this-实例
    //this.attr('id')->box1
    //字符串拼接 '#'+this.attr('id')=》#box1
    $(id+' input').click(function(){
        //当点击某个按钮的时候，让这个按钮变亮，同时让其他按钮变灭；
        $(this).addClass('bg').siblings('input').removeClass('bg');
        //让对应的内容框显示，同时让其他内容框隐藏
        $(id+' div').eq($(this).index()).addClass('show').siblings('div').removeClass('show');
    })
}
/*
function tab(){//#box1
    //this-实例；
    var id=this;
    var $inp=this.find('input');
    var $div=this.find('div');
    $inp.click(function(){
        //当点击某个按钮的时候，让这个按钮变亮，同时让其他按钮变灭；
        $(this).addClass('bg').siblings('input').removeClass('bg');
        //让对应的内容框显示，同时让其他内容框隐藏
        $div.eq($(this).index()).addClass('show').siblings('div').removeClass('show');
    })
}*/
