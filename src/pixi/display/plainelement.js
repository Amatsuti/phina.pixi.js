
/**
 * @class phina.pixi.display.PlainElement
 * @extends phina.app.Element
 */
phina.define('phina.pixi.display.PlainElement', {
  superClass: 'phina.display.DisplayElement',
  init: function(param){
    param=(param||{}).$safe(phina.pixi.display.PlainElement.defaults);

    this.canvas = param.canvas||phina.pixi.graphics.Canvas();
    this.canvas.width = param.width;
    this.canvas.height = param.height;

    this.context = this.canvas.canvas;

    this.superInit(param);
  },
  addChild: function(pixiObject){
    this.context.addChild(pixiObject.context);
    return this.superMethod('addChild', pixiObject);
  },
  addPixiChild: function(pixiObject){
    this.context.addChild(pixiObject);
    return this;
  },
  removeChild: function(pixiObject){
    this.context.removeChild(pixiObject.context);
    return this.superMethod('removeChild', pixiObject);
  },
  /**
   * X 座標値をセット
   * @param {Number} x
   */
  setX: function(x) {
    this.x = x;
    return this;
  },
  
  /**
   * Y 座標値をセット
   * @param {Number} y
   */
  setY: function(y) {
    this.y = y;
    return this;
  },
  
  /**
   * XY 座標をセット
   * @param {Number} x
   * @param {Number} y
   */
  setPosition: function(x, y) {
    this.x = x;
    this.y = y;
    return this;
  },

  on: function(type, listener, f){
    if(!f){
      this.context.on(type, listener.bind(this));
    }
    //なぜか3回呼ばれる対策でtrueにしておく
    return this.superMethod('on', type, listener, true);
  },

  _static:{
    defaults:{
      width:100, height:100,
      canvas:null,
    }
  },
  _defined: function(){
    this.prototype.$watch('x', function(newVal, oldVal) {
      this.context.x = newVal - this.originX * this.width;
    });
    this.prototype.$watch('y', function(newVal, oldVal) {
      this.context.y = newVal - this.originY * this.height;
    });
    this.prototype.$watch('rotation', function(newVal, oldVal) {
      this.context.rotation = newVal;
    });
    this.prototype.$watch('originX', function(newVal, oldVal) {
      this.context.x = newVal - this.originX * this.width;
    });
    this.prototype.$watch('originY', function(newVal, oldVal) {
      this.context.y = newVal - this.originY * this.height;
    });
    this.prototype.$watch('scaleX', function(newVal, oldVal) {
      this.context.scale.x = newVal;
    });
    this.prototype.$watch('scaleY', function(newVal, oldVal) {
      this.context.scale.y = newVal;
    });
    this.prototype.$watch('width', function(newVal, oldVal) {
      this.context.width = newVal;
    });
    this.prototype.$watch('height', function(newVal, oldVal) {
      this.context.height = newVal;
    });
    this.prototype.$watch('radius', function(newVal, oldVal) {
      this.context.radius = newVal;
    });
    this.prototype.$watch('interactive', function(newVal, oldVal) {
      this.context.interactive = newVal;
      this.context.buttonMode = newVal;
      this.__interactive = false;
    });
  },
});


