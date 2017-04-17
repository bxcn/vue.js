// 实际数据
var tradeData = Object.keys( window.trade ).map( function( id ) {
  var data = window.trade[ id ];
  data.id  = id;
  return data;
} );
function doTrade () {
  var _pool = [];
  tradeData.forEach( function( data ) {
    // 把每一个对象都放到_pool数组里
    data.childrens && data.childrens.forEach( function( _item ) {
      // 设置每一项的checked属性默认为false;
      _item.checked     = false;
      _pool[ _item.id ] = _item;
    } )
  } );
  return AOP.mixin( {
    data:function() {
      return trade;
    },
    find:function( args ) {
      // 根据编号查询对象并返回一个对象集合的数据
      if ( $.isArray( args ) ) {
        return args.map( function( id ) {
          return _pool[ id ];
        } );
      }
      return _pool[ args ];
    }
  } );
}
// 选择器
var doPicker = function() {
  var _data = [];
  var _prev = [];
  return AOP.mixin( {
    init:function( data ) {
      this.clear();
      var that = this;
      if ( data.length != 0 ) {
        data.forEach( function( _data ) {
          that.pick( _data );
        } )
      }
    },
    data:function() {
      // 这个返回的是选中的集合
      return _data;
    },
    pick:function( data ) {
      data.checked = true;
      _data.push( data );
    },
    unpick:function( index ) {
      var data     = _data[ index ];
      data.checked = false;
      _data.splice( index, 1 );
    },
    toggle:function( item ) {
      var index = $.inArray( item, _data );
      if ( ~index ) {
        this.unpick( index );
      } else {
        this.pick( item );
      }
    },
    clear:function() {
      _data.forEach( function( data ) {
        data.checked = false;
      } );
      _data = _prev;
      _prev = [];
    }
  } );
};
$( function() {
  var settings = {};
  var target   = {};
  // 行业数据
  var trade    = doTrade();
  // 行业选择器
  var picker   = doPicker();
  /**
   * Vue
   */
  var vueApp   = new Vue( {
    el:'#vueApp',
    data:{
      trade:trade.data()
    },
    methods:{
      toggle:function( event ) {
        var that = $( event.target || event.srcElement );
        var id   = that.data( 'id' );
        picker.toggle( trade.find( id ) );
      },
      close:function(){
        $('#vueApp').hide();
      }
    }
  } );
  
  /**
   * 选择前检查
   * @returns {boolean}
   */
  function doCheck () {
    var maxSize = settings.max || 5;
    var message = settings.tips || "最多选择" + maxSize + "个";
    if ( picker.data().length >= maxSize ) {
      alert( message );
      return false;
    }
  }
  
  /**
   * 渲染数据
   * @returns {{html: Array, value: Array}}
   */
  function render () {
    var data  = picker.data();
    var html  = [];
    var value = [];
    data.forEach( function( _data, index ) {
      var name = _data.name;
      var id   = _data.id;
      value.push( id );
      html.push( '<div class="tag-checked-name">' + name + '<em data-trade-close="' + index + '"></em></div>' )
    } );
    target.html( html.join( '' ) );
    target.attr( 'value', value.join( ',' ) );
    $(settings.input).val( value );
  }
  
  // AOP
  picker.before( 'pick', doCheck );
  picker.after( 'pick', render );
  picker.after( 'unpick', render );
  
  $.fn.trade = function( options ) {
    var node  = $( '#vueApp' );
    var that  = $( this );
    /**
     *
     * @type {*}
     */
    
    
    that.on( 'click', '[data-trade-close]', function() {
      init( that.attr( 'value' ) );
      // 关闭选中的
      var id = $( this ).data( 'trade-close' );
      picker.unpick( id );
    } );
    /**
     * 初始化数据
     * @param value
     */
    function init ( data ) {
      settings = options;
      target   = that;
      data     = data && trade.find( data.split( ',' ) ) || [];
      picker.init( data );
    }
    
    this.init = init;
    that.click( function() {
      init( that.attr( 'value' ) );
      node.show();
    } );
    return this;
  }
} );

