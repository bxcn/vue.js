(function () {
    // 实际数据
    var provinceData = window.city.data;
    var hotCityData = window.city.hot;

    function doProvince() {
        var province = provinceData;
        return AOP.mixin({
            data: function () {
                return province;
            }
        });

    }

    function doCity() {
        var _pool = [];
        provinceData.forEach(function (_d) {
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

                province.data().forEach(function (data) {
                    if (data.list) {
                        data.list = false;
                    }
                })

            }
        });
    }

    function doHotCity() {
        // 获取热门城市id数组
        var _hotCity = cityData.find(hotCityData.map(function (_d) {
            return _d.id;
        }));

        return AOP.mixin({
            data: function () {
                return _hotCity;
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
                    provinceData.clear();
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

                if (data.id == 0) {
                    this.isAll(false);
                }

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
                province.data().forEach(function (data) {
                    if (data.list) {
                        data.list = false;
                    }
                })

                if (p.childrens) {
                    p.list = !p.list;
                } else {
                    this.toggle(p);
                }
            },
            listChecked: function (p) {
                p.disabled = !p.disabled;
                this.toggle(p);
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

    var cityData = doCity();
    var hotCity = doHotCity();
    var province = doProvince();

    var vueApp = new Vue({
        el: '#vueApp',
        data: {
            hotCity: hotCity.data(),
            province: province.data()
        },
        methods: {
            toggle: function (event) {
                var target = event.target;
                var that = $(target);
                var id = that.data('id');
                var city = cityData.find(id);
                var pid = city.pid;
                if (pid && cityData.find(city.pid).disabled) {
                    return;
                }
                picker.toggle(city);

                callClick();
            },
            list: function (event) {
                var target = event.target;
                picker.list(cityData.find($(target).data('id')));
            },
            listChecked: function (event) {
                var target = event.target;
                picker.listChecked(cityData.find($(target).data('id')));
            },
            unpick: function (event) {
                var target = event.target;
                var key = $(target).attr("data-key");
                picker.unpick(key);
            }
        }
    });

    function init(value) {
        cityData.clear();
        var data =value;
        if (data) {
            data =  cityData.find(data.split(','));
        } else {
            data = [];
        }

        $.each(data, function (_, d) {
            d.checked = true;
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
        cityData.find(id).list = false;
    })

    window.cityPlugin = {
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
    $(document).on("click",'[data-city-load]',function(){
        var that = $(this);
        var value = that.attr('data-city-value');

        var offset = that.offset();
        var width = that.outerWidth();

        var top = offset.top - 120;
        var left = offset.left + width;

        cityPlugin.el().css({'left':left,'top':top});
        cityPlugin.setMaxSize(6).setMessage("最少输入六个").init(value).show();
        cityPlugin.click(function(){
            var data = cityPlugin.getData();
            console.log(data);
            that.html(data.map(function(d){ return d.name}).join(','));
        });
    });
});