// 实际数据
var provinceData = window.city.data;
var hotCityData = window.city.hot;

console.log(provinceData);
function doProvince() {
  var province = provinceData;
    return AOP.mixin({
        data: function() {
            return province;
        },
        find: function(args) {

            if ($.isArray(args)) {
                return args.map(function(id) {
                    return _pool[id];
                });
            }
            return _pool[args];
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
        data: function() {
            return _pool;
        },
        find: function(args) {

            if ($.isArray(args)) {
                return args.map(function(id) {
                    return _pool[id];
                });
            }
            return _pool[args];
        }
    });
}

var cityData = doCity();

function doHotCity(  ) {

    hotCityData = hotCityData.map(function (_d) {
        return _d.id;
    })

    var hotCity = cityData.find(hotCityData);

    return AOP.mixin({
        data: function() {
            return hotCity;
        },
        find: function(args) {

            if ($.isArray(args)) {
                return args.map(function(id) {
                    return _pool[id];
                });
            }
            return _pool[args];
        }
    });
}

// 选择器
var doPicker = function() {

  var _data = [];
  var _pev = [];

  return AOP.mixin({

    init: function(data) {
      if (data) {
        _data = data;
      }
      // 写缓存
      _prev = _data.concat();
    },
    data: function() {
      return _data;
    },

    pick: function(data) {
      data.checked = true;
      _data.push(data);
    },
    unpick: function(index) {

      var data = _data[index];
      data.checked = false;

      if (data.id == 0) {
        this.isAll(false);
      }

      _data.splice(index, 1);
    },
    toggle: function(city) {

      var index = $.inArray(city, _data);
      if (~index) {
        picker.unpick(index);
      } else {
        picker.pick(city);
      }
    },
    list: function(p) {
      // 点击省份时先清楚现在打开的tag
        province.data().forEach(function (data) {
            if( data.list ) {
                data.list = false;
            }
        })

      if( p.childrens) {

          p.list = !p.list;
      } else {
        this.toggle(p);
      }
    },
     listChecked: function(p) {
         p.disabled = !p.disabled;
        this.toggle(p);
    },
    cancel: function() {

      // 把原来选中的去掉
      $.each(_data, function(_, d) {
        d.checked = false;
      })

      //
      _data = _prev.concat();
      // 把缓存中的checkedo选中
      $.each(_data, function(_, d) {
        d.checked = true;
      });

      //vueApp._data.result = _data;

    }
  });
};


function doCheck() {
  if (picker.data().length >= 5) {
    alert('最多选择5个');
    return false;
  }
}

var picker = doPicker();
//var trader = doTrader();

picker.before('pick', doCheck);


var hotCity = doHotCity();
var province =  doProvince();

console.log(hotCity.data());

var vueApp = new Vue({
  el: '#vueApp',
  data: {
    hotCity: hotCity.data(),
      province:province.data()
  },
  methods: {
    toggle: function(event) {
      var target = event.target;
      var that = $(target);
      var id = that.data('id');
      var city = cityData.find(id);
      var disabled = cityData.find(city.pid).disabled;
      if(disabled) {
        return;
      }
      picker.toggle(city);
    },
    list: function(event) {
      var target = event.target;
      picker.list(cityData.find($(target).data('id')));
    },
    listChecked: function(event) {
      var target = event.target;
      picker.listChecked(cityData.find($(target).data('id')));
    },
    unpick: function(event) {
      var target = event.target;
        var key = $(target).attr("data-key");
        picker.unpick(key);
    }
  }
});

var node = $('#vueApp');

$(document)
.on('click', '[data-type="cancel"]', function() {
  picker.cancel();
  node.hide();
})
.on('click', '[data-type="init"]', function() {

  var data = $('[name="hidden"]').val();
  if (data) {
    data = data == 0 ? [picker.all()] : cityData.find(data.split(','));
  } else {
    data = [];
  }

  $.each(data, function(_, d) {
    d.checked = true;
  });

  //vueApp._data.result = data;
  picker.init(data);

  node.show();

})

.on('click', '[data-type="ok"]', function() {

  var data = picker.data();

  var value = $.map(data, function(trade) {
    trade.checked = false;
    return trade.id;
  }).join(',');

  data.splice(0);
  $('[name="hidden"]').val(value);

  node.hide();
})
