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

    //->格式化时间字符串
    function formatTime(template) {
        template = template || "{0}年{1}月{2}日 {3}时{4}分{5}秒";
        var _this = this,
            ary = _this.match(/\d+/g);//->[2016,05,19]
        template = template.replace(/\{(\d+)\}/g, function () {
            var val = ary[arguments[1]];
            typeof val === "undefined" ? val = 0 : null;
            val = val.length < 2 ? "0" + val : val;
            return val;
        });
        return template;
    }

    pro.queryURLParameter = queryURLParameter;
    pro.formatTime = formatTime;
}(String.prototype);


//->计算CONTENT及相关区域的高度
var scrollMenu;
~function () {
    var $content = $(".content"),
        $menu = $content.children(".menu"),
        $match = $content.find(".match");
    computedHeight();
    $(window).on("resize", computedHeight);
    function computedHeight() {
        var winH = $(window).outerHeight(),
            headerH = 64,
            resH = winH - headerH - 40;
        $content.css("height", resH);
        $menu.css("height", resH - 2);
        $match.css("height", resH - 82);
    }
}();

//->MENU
var menuRender = (function () {
    var menuData = '[{"name":"奥运","hash":"olympics","columnId":100009},{"name":"NBA","hash":"nba","columnId":100000},{"name":"欧洲杯","hash":"ec","columnId":3},{"name":"中超","hash":"csl","columnId":208},{"name":"亚冠","hash":"afc","columnId":605},{"name":"欧冠","hash":"ucl","columnId":5},{"name":"英超","hash":"pl","columnId":8},{"name":"西甲","hash":"laliga","columnId":23},{"name":"意甲","hash":"seriea","columnId":21},{"name":"德甲","hash":"bundesliga","columnId":22},{"name":"法甲","hash":"l1","columnId":24},{"name":"cba","hash":"cba","columnId":100008},{"name":"综合","hash":"others","columnId":100002},{"name":"NFL","hash":"nfl","columnId":100005}]';
    menuData = "JSON" in window ? JSON.parse(menuData) : eval("(" + menuData + ")");

    //->获取需要的元素
    var $menu = $(".content>.menu"),
        $menuCon = $menu.children("ul");

    //->bindHTML:使用EJS实现数据的绑定
    function bindHTML() {
        var str = $("#menuTemplate").html();
        var res = ejs.render(str, {data: menuData});
        $menuCon.html(res);

        //->实现MENU区域的局部滚动:只有等待页面渲染完成后,我们里面的UL才会被撑开,此时在初始化ISCROLL才能起到效果
        window.setTimeout(function () {
            var scrollMenu = new IScroll(".menu", {
                scrollbars: true,
                mouseWheel: true
            });
        }, 300);
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
        calendarRender.init($curLi.attr("columnId"));
    }

    //->bindEvent:给所有的LI绑定点击事件
    function bindEvent() {
        $menuCon.children("li").on("click", function () {
            $(this).addClass("bg").siblings().removeClass("bg");

            //->根据点击的是哪一项,让右侧的数据跟着动态显示
            calendarRender.init($(this).attr("columnId"));
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

//->calendar
var calendarRender = (function () {
    var $calendar = $(".calendar"),
        $wrapper = $calendar.children(".wrapper"),
        $slide = $wrapper.children(".slide");
    var maxL = 0, minL = 0;

    var $calendarPlan = $.Callbacks();//->发布一个计划(add/remove/fire)
    //->默认选中和定位到具体的位置
    $calendarPlan.add(function (today, data, columnId) {
        var $oLis = $slide.children("li"),
            $curLi = $oLis.filter("[date='" + today + "']");

        //->如果今天的日期在LI中没有,我们需要选择最近的那一项
        if ($curLi.length === 0) {
            var flag = 0;
            $oLis.each(function () {
                if (flag > 0) return;
                var eachLiTime = new Date($(this).attr("date").replace(/-/g, "/"));
                var todayTime = new Date(today.replace(/-/g, "/"));
                if (eachLiTime - todayTime > 0) {
                    $curLi = $(this);
                    flag++;
                }
            });
            if (flag === 0) {
                $curLi = $oLis.eq($oLis.length - 1);
            }
        }

        //->让当前的有选中的样式,并且运动到具体的位置,保证当前的LI在中间位置
        var curL = -$curLi.index() * 110 + 3 * 110;
        curL = curL < minL ? minL : (curL > maxL ? maxL : curL);
        $curLi.addClass("bg").parent().css("left", curL);

        //->把当前位置处对应的详细赛事进行绑定
        var sIn = Math.abs(parseFloat($slide.css("left")) / 110);
        var eIn = sIn + 6;
        matchRender.init(columnId, $oLis.eq(sIn).attr("date"), $oLis.eq(eIn).attr("date"));
    });

    //->给CALENDAR区域绑定事件
    $calendarPlan.add(function (today, data, columnId) {
        $calendar.on("click", function (ev) {
            var tar = ev.target,
                tarTag = tar.tagName.toUpperCase(),
                $tar = $(tar);

            if (tarTag === "SPAN" || tarTag === "A") {
                if (tarTag === "SPAN") {
                    tar = tar.parentNode;
                    $tar = $(tar);
                }

                //->左按钮 && 右按钮
                if ($tar.hasClass("btnLeft") || $tar.hasClass("btnRight")) {

                    var curL = parseFloat($slide.css("left"));
                    //->到达边界不在进行任何的操作
                    if (curL === minL && $tar.hasClass("btnRight")) {
                        return;
                    }
                    if (curL === maxL && $tar.hasClass("btnLeft")) {
                        return;
                    }

                    //->为了保证一屏幕显示7个,需要保证起始的curL的值是110的倍数
                    if (curL % 110 !== 0) {
                        curL = Math.round(curL / 110) * 110
                    }

                    //->在当前基础上加或者减770 && 如果超过边界使用边界值
                    $tar.hasClass("btnLeft") ? curL += 770 : curL -= 770;
                    curL = curL > maxL ? maxL : (curL < minL ? minL : curL);

                    //->开始运动
                    $slide.stop().animate({left: curL}, 300, "linear", function () {
                        //->运动完成后,让当前展示的这个7个中的第一个选中
                        var n = Math.abs(parseFloat($(this).css("left"))) / 110;
                        var $oLis = $(this).children("li");
                        $oLis.eq(n).addClass("bg").siblings().removeClass("bg");

                        //->把当前位置处对应的详细赛事进行绑定
                        var eIn = n + 6;
                        matchRender.init(columnId, $oLis.eq(n).attr("date"), $oLis.eq(eIn).attr("date"));
                    });
                    return;
                }

                //->LI中的A:滚动到具体的区域
                var curTime = $tar.parent().attr("date");
                var $curMatch = $(".matchInfo[date='" + curTime + "']");
                if ($curMatch.length > 0) {
                    scrollMatch.scrollToElement($curMatch[0], 300);
                }
            }
        });
    });

    //->bindHTML:获取数据绑定内容
    function bindHTML(columnId) {
        columnId = columnId || 100009;
        $.ajax({
            url: "http://matchweb.sports.qq.com/kbs/calendar?columnId=" + columnId,
            type: "get",
            dataType: "jsonp",
            success: function (jsonData) {
                if (jsonData && jsonData["code"] == 0) {
                    jsonData = jsonData["data"];
                    var today = jsonData["today"],
                        data = jsonData["data"];

                    //->使用EJS绑定数据
                    var res = ejs.render($("#calendarTemplate").html(), {calendarData: data});
                    $slide.html(res).css("width", data.length * 110);
                    minL = -(data.length - 7) * 110;//->计算出SLIDE运动的最小LEFT的值

                    //->通知计划中的方法执行
                    $calendarPlan.fire(today, data, columnId);
                }
            }
        });
    }

    return {
        init: bindHTML
    }
})();

//->MATCH
var scrollMatch = null;
var matchRender = (function () {
    var $match = $(".match"),
        $con = $match.children(".con");

    var $matchPlan = $.Callbacks();
    //->数据绑定
    $matchPlan.add(function (data) {
        var res = ejs.render($("#matchTemplate").html(), {data: data});
        $con.html(res);

        //->实现MATCH区域的局部滚动
        window.setTimeout(function () {
            if (!scrollMatch) {
                scrollMatch = new IScroll(".match", {
                    scrollbars: true,
                    mouseWheel: true
                });
            } else {
                scrollMatch.refresh();
            }
            //滚动到具体的区域
            var curTime = $(".slide>li[class=bg]").attr("date");
            var $curMatch = $(".matchInfo[date='" + curTime + "']");
            if ($curMatch.length > 0) {
                scrollMatch.scrollToElement($curMatch[0], 0);
            }
        }, 300);
    });

    return {
        init: function (columnId, startTime, endTime) {
            $.ajax({
                url: "http://matchweb.sports.qq.com/kbs/list?columnId=" + columnId + "&startTime=" + startTime + "&endTime=" + endTime,
                type: "get",
                dataType: "jsonp",
                success: function (jsonData) {
                    if (jsonData && jsonData["code"] == 0) {
                        var data = jsonData["data"];
                        $matchPlan.fire(data);
                    }
                }
            });
        }
    }
})();

menuRender.init();