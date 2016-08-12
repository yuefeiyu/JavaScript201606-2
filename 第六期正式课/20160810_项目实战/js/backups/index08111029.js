/*--公用方法--*/
~function (pro) {
    //->获取URL地址栏问号后面的参数值及HASH值
    function queryURLParameter() {
        var obj = {},
            reg = /([^?=&#]+)=([^?=&#]+)/g;
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        reg = /#([^?=&#]+)/;
        if (reg.test(this)) {
            obj["hash"] = reg.exec(this)[1];
        }
        return obj;
    }

    pro.queryURLParameter = queryURLParameter;
}(String.prototype);


var $content = $(".content"),
    $menu = $content.children(".menu");

//->计算CONTENT及相关区域的高度
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
        var res = ejs.render(str, {data: menuData});

        //->把获取到的内容放入到HTML页面中的指定位置上
        $menuCon.html(res);
    }

    //->positionLi:加载页面定位到具体的某一个LI
    function positionLi() {
        var obj = window.location.href.queryURLParameter(),
            hash = obj["hash"];
        typeof hash === "undefined" ? hash = "olympics" : null;

        var $curLi = $menuCon.children("li[hash='" + hash + "']");
        if ($curLi.length === 0) {
            $menuCon.children("li:eq(0)").addClass("bg");
            return;
        }
        $curLi.addClass("bg");

        //->根据定位的是哪一项,让右侧的数据跟着动态显示
    }

    //->bindEvent:给所有的LI绑定点击事件
    function bindEvent() {
        $menuCon.children("li").on("click", function () {
            $(this).addClass("bg").siblings().removeClass("bg");

            //->根据点击的是哪一项,让右侧的数据跟着动态显示
        });
    }

    return {
        init: function () {
            bindHTML();
            positionLi();
            bindEvent();
        }
    };
})();
menuRender.init();

















