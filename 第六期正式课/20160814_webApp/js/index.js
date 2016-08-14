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

//->REM
~function () {
    var desW = 320,
        winW = document.documentElement.clientWidth;
    document.documentElement.style.fontSize = winW / desW * 100 + "px";
}();

//->MENU
$(function () {
    var $nav = $(".nav"),
        $menu = $(".menu");
    $menu.singleTap(function () {
        $nav.toggleClass("target");
    });
});

//->MATCH
var matchRender = (function () {
    var $match = $(".match");

    function bindHTML(data) {
        var result = ejs.render($("#matchTemplate").html(), {matchInfo: data});
        $match.html(result);
        bindEvent();

        window.setTimeout(function () {
            var $progress = $match.find(".progress"),
                supL = parseFloat(data["leftSupport"]),
                supR = parseFloat(data["rightSupport"]);
            $progress.css("width", (supL / (supL + supR)) * 100 + "%");
        }, 300);
    }

    function bindEvent() {
        var $bot = $match.children(".bot"),
            $btnL = $bot.children(".left"),
            $btnR = $bot.children(".right"),
            $progress = $match.find(".progress");

        //->加载的时候首先判断当前是否点击过
        var support = localStorage.getItem("support");
        if (support) {
            support = JSON.parse(support);
            support.dir === 1 ? $btnL.addClass("bg") : $btnR.addClass("bg");
            return;
        }

        $btnL.singleTap(fn);
        $btnR.singleTap(fn);
        function fn(ev) {
            if ($bot.attr("isTap") === "true") return;

            //->当前点击的选中,在原来值的基础上加1
            var num = parseFloat($(this).html());
            $(this).addClass("bg").html(num + 1);

            //->从新控制进度
            var supLN = parseFloat($btnL.html()),
                supRN = parseFloat($btnR.html());
            $progress.css("width", (supLN / (supLN + supRN) * 100) + "%");

            //->点击一次就不能在点击了
            $bot.attr("isTap", true);

            //->告诉服务器点击的是哪一个
            var type = $(this).hasClass("left") ? 1 : 2;
            $.ajax({
                url: "http://matchweb.sports.qq.com/kbs/teamSupport?mid=100002:2365&type=" + type,
                type: "get",
                dataType: "jsonp"
            });

            //->把当前点击的数据存储到客户端本地,当下一次打开页面的时候首先判断是否点击过,如果点击过我们就不在允许点击了
            var obj = {
                isTap: true,
                dir: type
            };
            localStorage.setItem("support", JSON.stringify(obj));
        }
    }

    return {
        init: function () {
            $.ajax({
                url: "http://matchweb.sports.qq.com/html/matchDetail?mid=100002:2365",
                type: "get",
                dataType: "jsonp",
                success: function (data) {
                    //->数据重组
                    if (data && data[0] == 0) {
                        data = data[1];
                        var matchInfo = data["matchInfo"];
                        matchInfo["rightSupport"] = data["rightSupport"];
                        matchInfo["leftSupport"] = data["leftSupport"];

                        bindHTML(matchInfo);
                    }
                }
            });
        }
    }
})();
matchRender.init();





