(function () {
    // 实际数据
    var tradeData = Object.keys(window.trade).map(function (id) {
        var data = window.trade[id];
        data.id = id;
        return data;
    });
    function doFirstTrade() {
        var trade = tradeData;

        return AOP.mixin({
            data: function () {
                return trade;
            }
        });

    }

    function doPoolTrade() {
        var _pool = [];
        tradeData.forEach(function (_d) {
            _d.checked = false;
            _d.list = false;
            _pool[_d.id] = _d;

            if (_d.childrens) {
                _d.childrens.forEach(function (_item) {
                    _item.checked = false;
                    _pool[_item.id] = _item;
                })
            }

        });
        return AOP.mixin({
            data: function () {
                return _pool;
            },
            find: function (args) {

                if ($.isArray(args)) {
                    return args.map(function (id) {
                        return _pool[id];
                    });
                }
                return _pool[args];
            },
            clear: function () {
                _pool.forEach(function (data) {
                    data.checked = false;
                    data.disabled = false;
                });

                firstTrade.data().forEach(function (data) {
                    if (data.list) {
                        data.list = false;
                    }
                })

            }
        });
    }
// 选择器
    var doPicker = function () {

        var _data = [];
        var _pev = [];

        return AOP.mixin({

            init: function (data) {
                if (data) {
                    _data = data;
                }

                if (data.length == 0) {
                    poolTrade.clear();
                }
                // 写缓存
                _prev = _data.concat();
            },
            data: function () {
                return _data;
            },
            pick: function (data) {
                data.checked = true;
                _data.push(data);
            },
            unpick: function (index) {
                var data = _data[index];
                data.checked = false;
                _data.splice(index, 1);
            },
            toggle: function (city) {

                var index = $.inArray(city, _data);
                if (~index) {
                    picker.unpick(index);
                } else {
                    picker.pick(city);
                }
            },
            list: function (p) {
                // 点击省份时先清楚现在打开的tag
                firstTrade.data().forEach(function (data) {
                    if (data.list) {
                        data.list = false;
                    }
                })

                if (p.childrens) {
                    p.list = true;
                } else {
                    this.toggle(p);
                }
            },
            subAll: function (p) {
                var that = this;
                var c = !p.disabled;
                p.disabled = c;

                poolTrade.find(p.id).childrens.forEach(function (data) {
                    if(data.checked) {
                        that.toggle(data);
                    }
                });
                this.toggle(p);

                console.log(p.disabled);
            }
        });
    };


    var maxSize = 5;
    var message = "最多选择"+ maxSize +"个";
    function doCheck() {
        if (picker.data().length >= maxSize) {
            alert(message);
            return false;
        }
    }

    var picker = doPicker();

    picker.before('pick', doCheck);

    var callClick = function(){}

    var poolTrade = doPoolTrade();
    //var hotCity = doHotCity();
    var firstTrade = doFirstTrade();

    var vueApp = new Vue({
        el: '#vueApp',
        data: {
            //hotCity: hotCity.data(),
            firstTrade: firstTrade.data()
        },
        methods: {
            toggle: function (event) {
                var target = event.target;
                var that = $(target);
                var id = that.data('id');
                var city = poolTrade.find(id);
                var pid = city.pid;

                if (pid && poolTrade.find(pid).disabled ==  true) {
                    return;
                }
                picker.toggle(city);

                callClick();
            },
            list: function (event) {
                var target = event.target;
                picker.list(poolTrade.find($(target).data('id')));
                callClick();
            },
            subAll: function (event) {
                var target = event.target;
                picker.subAll(poolTrade.find($(target).data('id')));
                callClick();
            },
            unpick: function (event) {
                var target = event.target;
                var key = $(target).attr("data-key");
                picker.unpick(key);
            }
        }
    });

    function init(value) {
        poolTrade.clear();
        var data =value;
        if (data) {
            data =  poolTrade.find(data.split(','));
        } else {
            data = [];
        }

        $.each(data, function (_, d) {
            d.checked = true;
            if(d.childrens) {
                d.disabled = true;
            }
        });
        //vueApp._data.result = data;
        picker.init(data);

    }

    function getData() {
        return picker.data();
    }

    var node = $('#vueApp');
    node.on('click','.city-close', function () {
        node.hide();
    })

    $(document)
    .on('mouseleave', '.city-sub-block', function () {
        var that = $(this);
        var id = that.data('id');
       // poolTrade.find(id).list = false;
    })

    window.tradePlugin = {
        el: function() {
            return node;
        },
        init: function(value){
            init(value);
            return this;
        },
        show: function(){
            node.show();
        },
        hide: function(){
            node.hide();
            return this;
        },
        click: function(_callClick){
            callClick = _callClick;
            return this;
        },
        getData: function(){
            return getData()
        },
        setMessage: function(_message) {
            message = _message;
            return this;
        },
        setMaxSize: function(size) {
            maxSize = size;
            return this;
        }
    }
})();

$(function(){
    $(document).on("click",'[data-trade-load]',function(){
        var that = $(this);
        var value = that.attr('data-trade-value');

        var offset = that.offset();
        var width = that.outerWidth();

        var top = offset.top - 120;
        var left = offset.left + width;

        tradePlugin.el().css({'left':left,'top':top});
        tradePlugin.setMaxSize(6).setMessage("最少输入六个").init(value).show();
        tradePlugin.click(function(){
            var data = tradePlugin.getData();
            console.log(data);
            that.html(data.map(function(d){ return d.name}).join(','));
            that.attr('data-trade-value',data.map(function(d){ return d.id}).join(','))
        });
    });
});