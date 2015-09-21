var rabbit = {
    container: null,
    festival: [],
    build: function (container, time, fest, callback) {
        //取得容器
        if (!container) throw "no found container";
        this .container = container;
        container.innerHTML = this .templates.content;
        //显示的年月
        var time = arguments.length > 1 && arguments[1] ? arguments[1] : new Date();
        //节日
        this .festival = arguments.length > 2 && arguments[2] ? arguments[2] : [];
        //回调函数
        var callback = arguments.length > 3 && arguments[3] ? arguments[3] : function () { };
        //当前显示月份的相关信息
        var focus_year = time.getFullYear();
        var focus_month = time.getMonth();
        //本月第一天星期几
        var focus_weekday = new Date(focus_year, focus_month).getDay();
        //上个月有多少天
        var prev_month_date_count = new Date(focus_year, focus_month, 0).getDate();
        //这个月有多少天
        var current_month_date_count = new Date(focus_year, focus_month + 1, 0).getDate();
        //本月最后一天星期几
        var current_month_last_date_week = new Date(focus_year, focus_month + 1, 0).getDay();
        //写出当前年月
        this .first("calendar_current_year" ).innerHTML = focus_year;
        this .first("calendar_current_month" ).innerHTML = focus_month + 1;
        var result = "" ;
        //生成星期标题
        for (var i = 0; i < 7; i++) {
            result += this .format(this .templates.week_item, this.templates.week_title[i]);
        }
        //该计数用以判断是否周末
        var index = 0;
        //生成上月
        for (var i = prev_month_date_count - focus_weekday + 1; i < prev_month_date_count + 1; i++) {
            index++;
            result += this .format(this .templates.prev_month_item, i, this.handleFest(focus_year, focus_month - 1, i) ? " calendar_fest " : "");
        }
        //生成本月
        for (var i = 1; i < current_month_date_count + 1; i++) {
            index++;
            var className = "" ;
            if (index % 7 < 2) className += " calendar_weekend " ;
            if (focus_year == new Date().getFullYear() && focus_month == new Date().getMonth() && i == new Date().getDate())
                className += " calendar_today " ;
            if (this .handleFest(focus_year, focus_month, i))
                className += " calendar_fest " ;
            result += this .format(this .templates.current_month_item, i, className);
        }
        //生成下月
        for (var i = 1; i < 7 - current_month_last_date_week; i++) {
            result += this .format(this .templates.next_month_item, i,
            this.handleFest(focus_year, focus_month + 1, i) ? " calendar_fest " : "");
        }
        result += this .templates.clear;;
        this .first("calendar_content" ).innerHTML = result;
        //绑定点击事件
        this .bindClick(focus_year, focus_month, callback);
    },
    templates: {
        content: '<div class="rabbit_calendar"><div class="calendar_title">兔子日历</div><div class="calendar_time">\
                    <a class="calendar_prev_year">&lt;</a><span class="calendar_current_year">\
                    </span><a class="calendar_next_year">&gt;</a>&nbsp;\
                    <a class="calendar_prev_month">&lt;</a><span class="calendar_current_month">\
                    </span><a class="calendar_next_month">&gt;</a>\
                    </div><div class="calendar_content"></div></div>' ,
        week_title: [ "日" , "一" , "二", "三" , "四" , "五", "六" ],
        week_item: "<div class='calendar_item calendar_week_item'>{0}</div>" ,
        prev_month_item: "<div class='calendar_prev_month_item calendar_item {1}'>{0}</div>" ,
        current_month_item: "<div class='calendar_current_month_item calendar_item {1}'>{0}</div>" ,
        next_month_item: "<div class='calendar_next_month_item calendar_item {1}'>{0}</div>" ,
        clear: "<div class='clear'></div>"
    },
    handleFest: function (year, month, day) {
        for (var i = 0; i < this.festival.length; i++) {
            var fest_time = this .toDate(this.festival[i].time);
            if (fest_time.getFullYear() == year
                && fest_time.getMonth() == month
                && fest_time.getDate() == day)
                return true ;
        }
        return false ;
    },
    //绑定点击事件
    bindClick: function (focus_year, focus_month, callback) {
        function bind(className, year, month) {
            rabbit.eventBind(rabbit.first(className), "click" , function () {
                rabbit.build(rabbit.container, new Date(year, month), rabbit.festival, callback);
            });
        }
        bind( "calendar_prev_year" , focus_year - 1, focus_month);
        bind( "calendar_next_year" , focus_year + 1, focus_month);
        bind( "calendar_prev_month" , focus_year, focus_month - 1);
        bind( "calendar_next_month" , focus_year, focus_month + 1);

        var fest_items = this .find("calendar_fest");
        for (var i = 0; i < fest_items.length; i++) {
            this .eventBind(fest_items[i], "click" , function (e) {
                var className = e.target.className;
                var month, day;
                if (className.indexOf("calendar_prev_month_item" ) >= 0) month = focus_month - 1;
                else if (className.indexOf("calendar_current_month_item") >= 0) month = focus_month;
                else month = focus_month + 1;
                day = e.target.innerHTML;
                for (var j = 0; j < rabbit.festival.length; j++) {
                    var fest_time = rabbit.toDate(rabbit.festival[j].time);
                    if (fest_time.getFullYear() == focus_year
                        && fest_time.getMonth() == month
                        && fest_time.getDate() == day) {
                        callback(rabbit.festival[j]);
                    }
                }
            });
        }
    },
    first: function (className) {
        var all = this .container.getElementsByTagName('*');
        for (var e = 0; e < all.length; e++) {
            if (all[e].className.indexOf(className) >= 0) {
                return all[e];
            }
        }
        return null ;
    },
    find: function (className) {
        var all = this .container.getElementsByTagName('*');
        var arr = new Array();
        for (var e = 0; e < all.length; e++) {
            if (all[e].className.indexOf(className) >= 0) {
                arr.push(all[e]);
            }
        }
        return arr;
    },
    toDate: function (str) {
        var arr1 = str.split("-" );
        return new Date(parseInt(arr1[0], 10), parseInt(arr1[1], 10) - 1, parseInt(arr1[2], 10));
    },
    eventBind: function (C, A, B) {
        if (C.addEventListener) {
            C.addEventListener(A, B, false );
        }
        else {
            if (C.attachEvent) {
                C.attachEvent( "on" + A, B);
            }
        }
    },
    format: function () {
        if (arguments.length == 0)
            return null ;
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}' , 'gm' );
            str = str.replace(re, arguments[i]);
        }
        return str;
    }
}
