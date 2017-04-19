$( function() {
  
  // 实际数据
  var tradeData = Object.keys( window.trade ).map( function( id ) {
    var data = window.trade[ id ];
    data.id  = id;
    return data;
  } );
  
  /**
   * 对原始数据处理，处理成我们需要的
   * @returns {Object}
   */
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
  
  /**
   * 选择行业的选择器
   * 包括：选中 清空 初始化
   * @returns {Object}
   */
  function doPicker () {
    var _data = [];
    return AOP.mixin( {
      init:function( data ) {
        this.clear();
        var that = this;
        if ( $.isArray( data ) && data.length != 0 ) {
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
        var data = _data[ index ];
        if ( data ) {
          data.checked = false;
          _data.splice( index, 1 );
        }
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
        _data = [];
      }
    } );
  };
  /**
   * 对数据渲染和校验
   * @constructor
   */
  var TradeRender = (function() {
    // 实例对象
    var intance = null;
    
    function TradeRender () {
      var settings = {};
      var target   = {};
      // 行业数据
      var trade    = doTrade();
      // 行业选择器
      var picker   = doPicker();
      /**
       * 初始化
       */
      this.init = function( _settings, _target, data ) {
        settings = _settings;
        target   = _target;
        data     = data && trade.find( data.split( ',' ) ) || [];
        picker.init( data );
      }
      var tradeVueApp = new Vue( {
        el:'#tradeVueApp',
        data:{
          trade:trade.data()
        },
        methods:{
          toggle:function( event ) {
            var that = $( event.target || event.srcElement );
            var id   = that.data( 'id' );
            picker.toggle( trade.find( id ) );
          },
          close:function() {
            $( '#tradeVueApp' ).hide();
          }
        }
      } );
      // 删除选中的
      $( document ).on( 'click', '[data-trade-close]', function( event ) {
        // 关闭选中的
        var id = $( this ).data( 'trade-close' );
        picker.unpick( id );
        event.stopPropagation();
      } );
      // 删除选中的
      $( document ).on( 'mouseleave', '#tradeVueApp', function( event ) {
        var that = $( this );
        that.hide();
      } );
      // AOP
      picker.before( 'pick', doCheck );
      picker.after( 'pick', render );
      picker.after( 'unpick', render );
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
        $( settings.input ).val( value );
      }
    }
    
    return {
      intance:function() {
        if ( !intance ) {
          intance = new TradeRender();
        }
        return intance;
      }
    }
  })();
  $.extend( $.fn, {
    trade:function( options ) {
      // 默认状态
      var defaults    = {
        input:'#tradeHiddenValue2',
        max:6,
        tips:'最多输入六个'
      };
      var settings    = $.extend( {}, defaults, options );
      var tradeRender = TradeRender.intance();
      var element     = $( this );
      // 初始化数据，方便编辑操作
      var init        = this.init = function( data ) {
        tradeRender.init( settings, element, data );
      };
      
      /**
       * 返回元素的坐标
       * @param element 元素对象
       * @returns {{top: number, left: number}}
       */
      function position ( element ) {
        var offset = element.offset();
        var width  = element.outerWidth();
        var height = element.outerHeight();
        var top    = offset.top + height / 2 - 120;
        var left   = offset.left + width;
        return {
          top:top,
          left:left
        }
      }
      
      // 点击打开行业弹框
      element.click( function( event ) {
        var target = $( event.target );
        var offset = position( element );
        init( element.attr( 'value' ) );
        if ( target.hasClass( 'tag-checked-name' ) == false && target.is( '[data-trade-close]' ) == false ) {
          $( '#tradeVueApp' ).css( { 'left':offset.left, 'top':offset.top } ).show();
        }
      } );
      return this;
    }
  } )
} );

