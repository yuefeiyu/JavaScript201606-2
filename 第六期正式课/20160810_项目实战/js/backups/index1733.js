var $content = $(".content"),
    $menu = $content.children(".menu");

//->计算CONTENT及相关区域的高度:
//1)当前页面有且只有一屏幕,CONTENT高度=屏幕的高度-头部的高度-MARGIN
//2)剩余的区域都是基于CONTENT基础上再进行计算的
computedHeight();
$(window).on("resize", computedHeight);
function computedHeight() {
    var winH = $(window).outerHeight(),
        headerH = 64,
        resH = winH - headerH - 40;
    $content.css("height", resH);
    $menu.css("height", resH - 2);
}

//->MENU
var menuRender = (function () {
    //->准备MENU区域的数据
    var menuData = '[{"name":"奥运","hash":"olympics","columnId":100009},{"name":"NBA","hash":"nba","columnId":100000},{"name":"欧洲杯","hash":"ec","columnId":3},{"name":"中超","hash":"csl","columnId":208},{"name":"亚冠","hash":"afc","columnId":605},{"name":"欧冠","hash":"ucl","columnId":5},{"name":"英超","hash":"pl","columnId":8},{"name":"西甲","hash":"laliga","columnId":23},{"name":"意甲","hash":"seriea","columnId":21},{"name":"德甲","hash":"bundesliga","columnId":22},{"name":"法甲","hash":"l1","columnId":24},{"name":"cba","hash":"cba","columnId":100008},{"name":"综合","hash":"others","columnId":100002},{"name":"NFL","hash":"nfl","columnId":100005}]';
    menuData = "JSON" in window ? JSON.parse(menuData) : eval("(" + menuData + ")");

    //->获取需要的元素
    var $menu = $(".content>.menu"),
        $menuCon = $menu.children("ul");

    //->bindHTML:实现数据绑定(字符串拼接:把HTML中写好的结构搬入到JS代码中然后在重新的拼接在一起,最后存储到页面的某一个容器中)
    function bindHTML() {
        var str = '';
        $.each(menuData, function (index, curData) {
            //->在数据绑定的时候,把一些信息值存储到元素的自定义属性上,这样以后在需要使用的话,直接的去自定义属性上进行查找即可
            str += '<li columnId="' + curData["columnId"] + '" hash="' + curData["hash"] + '"><a href="javascript:;">';
            str += '<span>' + curData["name"] + '</span>';
            str += '<i><span class="mark over"></span><span class="mark"></span></i>';
            str += '</a></li>';
        });
        $menuCon.html(str);
    }

    //->默认控制对应的LI被选中:取决于本页面URL地址后面默认的HASH值(#xxx)
    function control() {
        $menuCon.children("li").eq(0).addClass("bg");
    }

    return {
        init: function () {
            bindHTML();
            control();
        }
    };
})();
menuRender.init();

















