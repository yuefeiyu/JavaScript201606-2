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

    //->lazy img
    function lazyImg(activeIndex) {
        var prevIndex = activeIndex - 1,
            nextIndex = activeIndex + 1;
        $wrapper.find("img").each(function (index, curImg) {
            if (index === activeIndex || index === prevIndex || index === nextIndex) {s
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
        var result = ejs.render($("#banner-slide").html(), {data: data});
        $wrapper.html(result)
            .css("width", pageW * data.length)
            .children(".slide").css("width", pageW);

        result = ejs.render($("#banner-tip").html(), {total: data.length - 2});
        $tip.html(result);

        //->数据绑定完成后在做延迟加载
        lazyImg(1);
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