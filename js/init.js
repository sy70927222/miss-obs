$(function () {
    miss.init();
});

const miss = {
    timeIndex: 0,
    /* 文字滚动特效 */
    data: {},
    init: () => {  /* 初始化 */
        miss.initData();
        setInterval(() => {
            miss.initData();
        }, 30 * 1000)
    },
    initData: () => {
        $.getJSON("https://sy70927222.github.io/miss-obs/json/data.json", (data)=>{
            debugger;
            if (data !== miss.data) {
                if (data.title) {
                    $("#title").show().html(`<h1>${data.title}</h1>`);
                }
                //礼物面板
                if (data.gifts) {
                    $("#nav").html("");
                    for (let gift of data.gifts) {
                        $("#nav").append(`<li class="layui-nav-item"><a href="#">
							<i class="layui-icon" style="background: url(${gift.img}) no-repeat;"></i>${gift.description}</a></li>`);
                    }
                }
                if (data.isHome) {
                    $("#home").show();
                }
                if (data.isTime && data.isTime !== miss.data.isTime) {
                    clearInterval(miss.timeIndex);
                    $("#time").show();
                    data.timeIndex = miss.timeEnd(data.longTime * 60);
                }
                miss.data = data;
            }
        });
    },
    timeEnd: (longTime) => {	/* 倒计时方法 */
        return setInterval(() => {
            let day = 0,
                hour = 0,
                minute = 0,
                second = 0;//时间默认值
            if (longTime > 0) {
                day = Math.floor(longTime / (60 * 60 * 24));
                hour = Math.floor(longTime / (60 * 60)) - (day * 24);
                minute = Math.floor(longTime / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(longTime) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }
            $("#timeEnd").html(`直播结束：${hour < 9 ? `0${hour}` : hour}:${minute < 9 ? `0${minute}` : minute}:${second < 9 ? `0${second}` : second}`);
            longTime--;
        }, 1000);
    }
}