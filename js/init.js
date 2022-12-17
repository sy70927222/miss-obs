$(function () {
    miss.init();
});

const miss = {
    timeIndex: 0,
    rollIndex: 0,
    longTime: 6 * 60 * 60,
    /* 文字滚动特效 */
    data: {},
    init: () => {  /* 初始化 */
        miss.initData();
        /* 多少分钟同步更新数据 */
        setInterval(() => {
            miss.initData();
        }, 2 * 60 * 1000)
    },
    initData: () => {
        $.getJSON("./json/data.json", data => {
            if (JSON.stringify(data) !== JSON.stringify(miss.data)) {
                if (data.title) {
                    $("#title").show().html(`<h1>${data.title}</h1>`);
                }
                debugger;
                //礼物面板
                $("#nav").html("");
                if (data.gifts.length > 0) {
                    for (let gift of data.gifts) {
                        $("#nav").append(`<li class="layui-nav-item"><a href="#">
							<i class="layui-icon fans" style="background: url(${gift.img}) no-repeat;"></i>${gift.description}</a></li>`);
                    }
                }

                if (data.socials.length > 0) {
                    for (let social of data.socials) {
                        $("#nav").append(`<li class="layui-nav-item"><a href="#">
							<i class="layui-icon" style="background: url(${social.img}) no-repeat;${social.style}"></i>${social.description}</a></li>`);
                    }
                }

                data.isHome ? $("#home").show() : $("#home").hide();
                if (data.isTime) {
                    clearInterval(miss.timeIndex);
                    miss.timeIndex = miss.timeEnd(miss.longTime + (data.longTime * 60))
                    $("#time").show();
                } else {
                    $("#time").hide();
                }
                miss.data = data;

                /* 贵宾席 */
                $("#guest").html("");
                if (data.isGuests) {
                    $("#guests").show();

                    if (data.guests.length > 0) {
                        let index = 1;
                        for (let guest of data.guests) {
                            $("#guest").append(`<li>${index}。${guest}</li>`);
                            index++;
                        }
                    }

                    if (data.guests.length > 8) {
                        clearInterval(miss.rollIndex);
                        miss.rollIndex = miss.rollY("guest");
                    }
                }
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
            miss.longTime = longTime;
        }, 1000);
    },
    rollY: (id) => {
        let element = document.getElementById(id);
        let rollType = true;
        return setInterval(() => {
            if (element.scrollTop >= element.scrollHeight/2) {
                rollType = false;
            }
            if (element.scrollTop <= 0) {
                rollType = true;
            }

            if (rollType) {
                element.scrollTop = element.scrollTop + 1;
            } else {
                element.scrollTop = element.scrollTop - 1;
            }
        }, 100);
    }
}