//->以后只要是在移动端实现滑动操作,这句话是必须要添加的:阻止浏览器本身滑动时候的默认行为
$(document).on("touchmove", function (ev) {
    ev.preventDefault();
});

//->REM
var pageW = document.documentElement.clientWidth;
~function (desW) {
    var winW = document.documentElement.clientWidth,
        $main = $(".main"),
        ratio = winW / desW;
    if (winW > desW) {
        pageW = desW;
        $main.css({
            margin: "0 auto",
            width: desW
        });
        return;
    }
    $(document.documentElement).css({
        fontSize: ratio * 100
    });
}(750);

//->banner module
var bannerRender = (function () {
    var $banner = $(".banner"),
        $wrapper = $banner.children(".wrapper"),
        $tip = $banner.children(".tip");

    var autoTimer = null,
        delayTimer = null,
        interval = 2000,
        step = 1,
        count = 0;

    //->编写方法获取是否滑动和滑动的方向
    function isSwipe(strX, strY, endX, endY) {
        return Math.abs(endX - strX) > 30 || Math.abs(endY - strY) > 30;
    }

    function swipeDir(strX, strY, endX, endY) {
        var changeX = endX - strX,
            changeY = endY - strY;
        return Math.abs(changeX) >= Math.abs(changeY) ? (changeX > 0 ? "right" : "left") : (changeY > 0 ? "down" : "up");
    }

    //->bind event
    function bindEvent() {
        $wrapper.on("touchstart", function (ev) {
            var point = ev.touches[0];
            $(this).attr({
                strX: point.pageX,
                strY: point.pageY,
                strL: parseFloat($(this).css("left"))
            });
            window.clearInterval(autoTimer);

        }).on("touchmove", function (ev) {
            var point = ev.touches[0];

            //->滑动过程中计算当前X/Y轴的值以及X轴的偏移值
            $(this).attr({
                endX: point.pageX,
                endY: point.pageY,
                changeX: point.pageX - parseFloat($(this).attr("strX"))
            });

            //->计算出是否发生滑动,以及滑动的方向
            $(this).attr({
                isFlag: isSwipe(parseFloat($(this).attr("strX")), parseFloat($(this).attr("strY")), parseFloat($(this).attr("endX")), parseFloat($(this).attr("endY"))),
                dir: swipeDir(parseFloat($(this).attr("strX")), parseFloat($(this).attr("strY")), parseFloat($(this).attr("endX")), parseFloat($(this).attr("endY")))
            });

            //->如果发生了滑动并且是左右滑动,我们让当前元素在起始的位置基础上+X轴的偏移,从而计算出最新的LEFT值(边界判断)
            if ($(this).attr("isFlag") === "true" && /^(left|right)$/.test($(this).attr("dir"))) {
                var curL = parseFloat($(this).attr("strL")) + parseFloat($(this).attr("changeX"));
                var minL = -(count - 1) * pageW, maxL = 0;
                curL = curL > maxL ? maxL : (curL < minL ? minL : curL);
                $wrapper[0].style.webkitTransitionDuration = "0s";
                $wrapper.css("left", curL);
            }
        }).on("touchend", function (ev) {
            //->只有当前是滑动并且是左右滑动在手机离开的时候我们才进行轮播图的切换
            var dir = $(this).attr("dir"),
                isFlag = $(this).attr("isFlag"),
                changeX = parseFloat($(this).attr("changeX"));
            if (isFlag === "true" && /^(left|right)$/.test(dir)) {
                //->滑动的距离超过屏幕的1/3切换到下一张
                if (Math.abs(changeX) >= pageW / 2) {
                    if (dir === "left") {
                        step++;
                    }
                    if (dir === "right") {
                        step--;
                    }
                }

                //->让当前元素运动到step的位置
                $wrapper[0].style.webkitTransitionDuration = ".3s";
                $wrapper.css("left", -step * pageW);
                lazyImg(step);
                changeTip();

                //->当运动到step位置的时候(300ms),我们对边界进行处理
                delayTimer = window.setTimeout(function () {
                    $wrapper[0].style.webkitTransitionDuration = "0s";
                    if (step === count - 1) {
                        step = 1;
                        $wrapper.css("left", -step * pageW);
                    }
                    if (step === 0) {
                        step = count - 2;
                        $wrapper.css("left", -step * pageW);
                    }
                    lazyImg(step);
                    changeTip();
                }, 300);

            }
            autoTimer = window.setInterval(autoMove, interval);

            //->把设置的自定义属性值都设置为空
            $.each(["strX", "strY", "endX", "endY", "strL", "changeX", "isFlag", "dir"], function (index, item) {
                $wrapper.removeAttr(item);
            });
        });
    }


    //->auto move
    function autoMove() {
        //if (step >= count) {
        //    //->到达右边界的时候,我们让LEFT立马回到索引为1的位置
        //    $wrapper[0].style.webkitTransitionDuration = "0s";
        //    $wrapper.css("left", -pageW);
        //
        //    //->由于改变元素的位置会引发DOM回流重构,这个阶段需要时间,所以我们做一个延迟,100ms后等彻底回到索引为1的位置,我们在让其运动到索引为2的位置
        //    delayTimer = window.setTimeout(function () {
        //        $wrapper[0].style.webkitTransitionDuration = ".3s";
        //        step = 2;
        //        $wrapper.css("left", -step * pageW);
        //        changeTip();
        //        window.clearTimeout(delayTimer);
        //    }, 100);
        //    return;
        //}
        $wrapper[0].style.webkitTransitionDuration = ".3s";
        step++;
        $wrapper.css("left", -step * pageW);

        if (step === count - 1) {
            window.setTimeout(function () {
                $wrapper[0].style.webkitTransitionDuration = "0s";
                step = 1;
                $wrapper.css("left", -step * pageW);
            }, 300);
        }

        //->切换一次都需要重新的给当前活动页及相邻两页做延迟加载
        lazyImg(step);

        //->切换一次需要改变TIP
        changeTip();
    }

    //->change tip
    function changeTip() {
        var temp = step;
        temp === 0 ? temp = count - 2 : null;
        temp === count - 1 ? temp = 1 : null;
        $tip.children("li").each(function (index) {
            temp - 1 === index ? $(this).addClass("bg") : $(this).removeClass("bg");
        });
    }

    //->lazy img
    function lazyImg(activeIndex) {
        var prevIndex = activeIndex - 1,
            nextIndex = activeIndex + 1;
        $wrapper.find("img").each(function (index, curImg) {
            if (index === activeIndex || index === prevIndex || index === nextIndex) {
                var _this = this,
                    isLoad = $(_this).attr("isLoad");
                if (isLoad === "1") return;

                var oImg = new Image;
                oImg.src = $(_this).attr("data-src");
                oImg.onload = function () {
                    $(_this).attr({
                        src: this.src,
                        isLoad: 1
                    }).css("display", "block");
                    oImg = null;
                }
            }
        });
    }

    //->bind html
    function bindHTML(data) {
        //->为了实现双向无缝滚动:把第一张复制一份放末尾,把最后一张复制一份放在开头
        data.push(data[0]);
        data.unshift(data[data.length - 2]);
        count = data.length;

        var result = ejs.render($("#banner-slide").html(), {data: data});
        $wrapper.html(result)
            .css("width", pageW * data.length)
            .children(".slide").css("width", pageW);

        result = ejs.render($("#banner-tip").html(), {total: data.length - 2});
        $tip.html(result);

        //->数据绑定完成后在做延迟加载
        lazyImg(step);

        //->数据绑定完成后实现自动轮播
        autoTimer = window.setInterval(autoMove, interval);

        //->绑定滑动的事件
        bindEvent();
    }

    return {
        init: function () {
            //->get data
            $.ajax({
                url: "json/banner.json",
                type: "get",
                dataType: "json",
                success: function (data) {
                    bindHTML(data);
                }
            });
        }
    }
})();
bannerRender.init();