/**
 * Created by xiao lei on 2016/7/8.
 */
$.extend({
    tab:tab
});
function tab(id){//#box1
    $(id+' input').click(function(){
        //当点击某个按钮的时候，让这个按钮变亮，同时让其他按钮变灭；
        $(this).addClass('bg').siblings('input').removeClass('bg');
        //让对应的内容框显示，同时让其他内容框隐藏
        $(id+' div').eq($(this).index()).addClass('show').siblings('div').removeClass('show');
    })
}