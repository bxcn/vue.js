$( function() {
  // 实际数据
  var provinceData = window.city.data;
  var hotcity      = window.city.hot;
  
  /**
   * 热门城市
   * 全部列表，
   * @returns {Object}
   */
  function doProvince () {
    var province = provinceData;
    // 获取热门城市id数组
    var _hotCity = doCity().find( hotcity.map( function( _d ) {
      return _d.id;
    } ) );
    return AOP.mixin( {
      data:function() {
        return province;
      },
      hotData:function() {
        return _hotCity;
      }
    } );
  }
  
  /**
   * 所有省市级别
   *
   * @returns {Object} 返回一个对象集合，
   */
  function doCity () {
    var _pool = [];
    provinceData.forEach( function( data ) {
      data.checked = data.selected = data.list = false;
      // 省级和直辖市
      _pool[ data.id ] = data;
      // 判断是否是省级
      if ( data.childrens ) {
        data.childrens.forEach( function( data ) {
          // 默认给一个不选中状态
          data.checked     = false;
          // 添加市
          _pool[ data.id ] = data;
        } )
      }
    } );
    return AOP.mixin( {
      data:function() {
        return _pool;
      },
      find:function( args ) {
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
   * 选择器
   * @returns {Object}
   */
  var doPicker   = function() {
    var _data = [];
    var _list = null;
    return AOP.mixin( {
      init:function( data ) {
        this.clear();
        var that = this;
        if ( data.length != 0 ) {
          data.forEach( function( _data ) {
            that.pick( _data );
          } )
        }
        this.clearList();
      },
      data:function() {
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
      toggle:function( city ) {
        var index = $.inArray( city, _data );
        if ( ~index ) {
          this.unpick( index );
        } else {
          this.pick( city );
        }
      },
      clearList:function( item ) {
        // 点击省份时先清楚现在打开的tag
        var data = _list;
        if ( _list && (arguments.length == 0 || item.id != data.id) ) {
          data.list = data.selected = false;
          _list == null;
        }
      },
      list:function( item ) {
        
        // 判断是否是省份级
        if ( item.childrens ) {
          this.clearList( item );
          //已经是选中状态
          if ( item.selected ) {
            item.list = item.selected = false;
          } else {
            item.list = item.selected = true;
            _list = item;
          }
        } else {
          this.toggle( item );
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
  var CityRender = (function() {
    var intance = null;
    
    function CityRender () {
      var settings = {};
      var target   = {};
      var city     = doCity();
      var province = doProvince();
      var picker   = doPicker();
      var vueApp   = new Vue( {
        el:'#vueApp',
        data:{
          hotCity:province.hotData(),
          province:province.data()
        },
        methods:{
          toggle:function( event ) {
            var target = event.target;
            var that   = $( target );
            var id     = that.data( 'id' );
            var item   = city.find( id );
            var pid    = item.pid;
            if ( pid && city.find( pid ).disabled == true ) {
              return;
            }
            if ( settings.max == 1 ) {
              picker.clear();
            }
            picker.toggle( item );
          },
          list:function( event ) {
            var target = event.target;
            var parent = city.find( $( target ).data( 'id' ) );
            if ( parent.childrens ) {
              picker.list( parent );
            } else {
              this.toggle( event );
            }
          },
          close:function() {
            $( '#vueApp' ).hide();
          }
        }
      } );
      // 删除选中的
      $( document ).on( 'click', '[data-city-close]', function( event ) {
        // 关闭选中的
        var id = $( this ).data( 'city-close' );
        picker.unpick( id );
        event.stopPropagation();
      } );
      // AOP
      picker.before( 'pick', doCheck );
      picker.after( 'pick', render );
      picker.after( 'unpick', render );
      /**
       * 初始化
       */
      this.init = function( _settings, _target, data ) {
        settings = _settings;
        target   = _target;
        var type = $.type( data );
        if ( type == 'string' ) {
          data = data.split( ',' );
        }
        data = data.filter( function( data ) {
            return data != '';
          } ) || [];
        picker.init( city.find( data ) );
      }
      /**
       * 选择前检查
       * @returns {boolean}
       */
      function doCheck () {
        var maxSize = settings.max || 5;
        var message = settings.tips || "最多选择" + maxSize + "个";
        if ( maxSize == 1 ) {
          $( '#vueApp' ).hide();
          return true;
        }
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
          html.push( '<div class="tag-checked-name">' + name + '<em data-city-close="' + index + '"></em></div>' )
        } );
        target.html( html.join( '' ) );
        target.attr( 'value', value.join( ',' ) );
        $( settings.input ).val( value );
      }
    }
    
    return {
      intance:function() {
        if ( !intance ) {
          intance = new CityRender();
        }
        return intance;
      }
    }
  })();
  $.fn.city      = function( options ) {
    var cityRender = CityRender.intance();
    var that       = $( this );
    // 初始化数据，方便编辑操作
    var init       = this.init = function( data ) {
      cityRender.init( options, that, data );
    };
    // 点击打开行业弹框
    that.click( function( event ) {
      event      = window.event || event;
      var target = event.srcElement || event.target;
      var that   = $( this );
      var offset = that.offset();
      var width  = that.outerWidth();
      var height = that.outerHeight();
      var top    = offset.top + height / 2 - 120;
      var left   = offset.left + width;
      var val    = that.attr( 'value' );
      init( val );
      if ( $( target ).hasClass( 'tag-checked-name' ) == false && $( target ).is( '[data-city-close]' ) == false ) {
        $( '#vueApp' ).css( { 'left':left, 'top':top } ).show();
      }
    } );
    return this;
  }
} );