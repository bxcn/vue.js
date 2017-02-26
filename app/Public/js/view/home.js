// 行业
function doTrader() {



  // 实际数据
  var _data = [
    { "id": 1, "name": "互联网·游戏·软件", "data": [{ "id": 5, "name": "网络游戏", "pid": 1, "checked": false }, { "id": 4, "name": "计算机软件", "pid": 1 }, { "id": 2, "name": "互联网/电子商务", "pid": 1 }, { "id": 1, "name": "计算机硬件", "pid": 1 }] },
    { "id": 2, "name": "电子·通信·硬件", "data": [{ "id": 35, "name": "通信/电信/网络设备", "pid": 2, "checked": false }, { "id": 34, "name": "通信/电信运营、增值服务", "pid": 2 }, { "id": 33, "name": "电子技术/半导体/集成电路", "pid": 2 }] },
    { "id": 3, "name": "房地产·建筑·物业", "data": [{ "id": 9, "name": "家居/室内设计/装潢", "pid": 3 }, { "id": 8, "name": "物业管理/商业中心", "pid": 3 }, { "id": 7, "name": "房地产开发", "pid": 3 }, { "id": 6, "name": "建筑/建材/工程", "pid": 3 }] },
    { "id": 4, "name": "金融", "data": [{ "id": 20, "name": "会计/审计", "pid": 4 }, { "id": 12, "name": "保险", "pid": 4 }, { "id": 11, "name": "银行", "pid": 4 }, { "id": 10, "name": "金融/投资/证券", "pid": 4 }] },
    { "id": 5, "name": "消费品", "data": [{ "id": 27, "name": "奢侈品/收藏品", "pid": 5 }, { "id": 26, "name": "家具/家电/工艺品/玩具/珠宝", "pid": 5 }, { "id": 24, "name": "批发/零售", "pid": 5 }, { "id": 23, "name": "服装/纺织/皮革", "pid": 5 }] },
    { "id": 6, "name": "汽车·机械·制造", "data": [{ "id": 39, "name": "汽车及零配件", "pid": 6 }, { "id": 38, "name": "原材料和加工", "pid": 6 }, { "id": 37, "name": "仪器仪表/工业自动化", "pid": 6 }, { "id": 36, "name": "机械/设备/重工", "pid": 6 }, { "id": 32, "name": "印刷/包装/造纸", "pid": 6 }] },
    { "id": 7, "name": "服务·外包·中介", "data": [{ "id": 56, "name": "外包服务", "pid": 7 }, { "id": 55, "name": "检测，认证", "pid": 7 }, { "id": 43, "name": "娱乐/休闲/体育", "pid": 7 }, { "id": 42, "name": "生活服务", "pid": 7 }, { "id": 41, "name": "酒店/旅游", "pid": 7 }, { "id": 40, "name": "餐饮业", "pid": 7 }, { "id": 21, "name": "中介服务", "pid": 7 }, { "id": 19, "name": "法律", "pid": 7 }, { "id": 18, "name": "专业服务(咨询、人力资源、财会）", "pid": 7 }] },
    { "id": 8, "name": "广告·传媒·教育·文化", "data": [{ "id": 47, "name": "学术/科研", "pid": 8 }, { "id": 31, "name": "文字媒体/出版", "pid": 8 }, { "id": 30, "name": "影视/媒体/艺术/文化传播", "pid": 8 }, { "id": 29, "name": "广告", "pid": 8 }, { "id": 28, "name": "公关/市场推广/会展", "pid": 8 }, { "id": 17, "name": "教育/培训/院校", "pid": 8 }] },
    { "id": 9, "name": "交通·贸易·物流", "data": [{ "id": 46, "name": "航天/航空", "pid": 9 }, { "id": 45, "name": "交通/运输/物流", "pid": 9 }, { "id": 44, "name": "贸易/进出口", "pid": 9 }] },
    { "id": 10, "name": "制药·医疗", "data": [{ "id": 16, "name": "医疗设备/器械", "pid": 10 }, { "id": 15, "name": "美容/保健", "pid": 10 }, { "id": 14, "name": "医疗/护理/卫生", "pid": 10 }, { "id": 13, "name": "制药/生物工程", "pid": 10 }] },
    { "id": 11, "name": "能源·化工·环保", "data": [{ "id": 57, "name": "环保", "pid": 11 }, { "id": 51, "name": "电力/水利", "pid": 11 }, { "id": 50, "name": "新能源", "pid": 11 }, { "id": 49, "name": "采掘业/冶炼", "pid": 11 }, { "id": 48, "name": "石油/化工/矿产/地质", "pid": 11 }] },
    { "id": 12, "name": "政府·农林牧渔", "data": [{ "id": 58, "name": "其他行业", "pid": 12 }, { "id": 54, "name": "农/林/牧/渔", "pid": 12 }, { "id": 53, "name": "非盈利机构", "pid": 12 }, { "id": 52, "name": "政府/公共事业", "pid": 12 }] },
    { "id": 13, "name": "其他", "data": [{ "id": 59, "name": "多元化业务集团公司", "pid": 13 }] }
  ];

  var _pool = [];

  $.each($.map(_data, function(data) {
    return data.data;
  }), function(_, trade) {
    trade.checked = false;
    _pool[trade.id] = trade;
  });

  return AOP.mixin({
    data: function() {
      return _data;
    },
    find: function(args) {

      if ($.isArray(args)) {
        return $.map(args, function(id) {
          return _pool[id];
        })
      }
      return _pool[args];
    }
  });
}


// 选择器
var doPicker = function() {

  var _data = [];
  var _pev = [];

  // `全部`选择
  var _isAll = false;

  var _ALL_ = {
    "id": "0",
    "name": "全部",
    "checked": false
  };

  return AOP.mixin({

    init: function(data) {


      if (data) {
        _data = data;

        this.isAll(data.length && data[0].id == 0);
      }

      // 写缓存
      _prev = _data.concat();
    },
    data: function() {
      return _data;
    },
    all: function() {
      return _ALL_;
    },
    isAll: function(bool) {
      if (bool === undefined) {
        return _isAll;
      }
      _isAll = bool;
    },
    pickall: function() {
      if (this.isAll()) {
        this.unpick(0);
        _ALL_.checked = false;
      } else {
        this.isAll(true);

        $.each(_data, function(_, d) {
          d.checked = false;
        });

        _data.splice(0);

        this.pick(_ALL_);
      }
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
    toggle: function(trade) {
      if (this.isAll()) {
        return;
      }

      var index = $.inArray(trade, _data);
      if (~index) {
        picker.unpick(index);
      } else {
        picker.pick(trade);
      }
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

      vueApp._data.result = _data;

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
var trader = doTrader();

picker.before('pick', doCheck);

var vueApp = new Vue({
  el: '#vueApp',
  data: {
    isAll: picker.all(),
    items: trader.data(),
    result: picker.data()
  },
  methods: {
    toggle: function(event) {
      var target = event.target;
      picker.toggle(trader.find($(target).data('id')));
    },
    pickall: function() {
      picker.pickall();
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
    data = data == 0 ? [picker.all()] : trader.find(data.split(','));
  } else {
    data = [];
  }

  $.each(data, function(_, d) {
    d.checked = true;
  });

  vueApp._data.result = data;
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
