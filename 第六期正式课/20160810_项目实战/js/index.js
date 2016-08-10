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

    //->bindHTML:使用EJS模板解析我们需要的内容最后实现数据的绑定
    function bindHTML() {
        //->把HTML模板中的内容全部获取到
        var str = $("#menuTemplate").html();

        //->把模板字符串和需要绑定的数据统一交给EJS渲染
        var res = ejs.render(str, {data: menuData})

        //->把获取到的内容放入到HTML页面中的指定位置上
        $menuCon.html(res);
    }

    bindHTML();
})();

















