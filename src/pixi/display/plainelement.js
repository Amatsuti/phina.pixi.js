
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
  _accessor: {
    /**
     * @property    x
     * x座標値
     */
    x: {
      "get": function()   { return this.position.x; },
      "set": function(v)  { 
        this.position.x = v;
        this.context.x = this.position.x - this.originX * this.width;
      }
    },
    /**
     * @property    y
     * y座標値
     */
    y: {
      "get": function()   { return this.position.y; },
      "set": function(v)  {
        this.position.y = v;
        this.context.y = this.position.y - this.originY * this.height;
      }
    },

    /**
     * @property    originX
     * x座標値
     */
    originX: {
      "get": function()   { return this.origin.x; },
      "set": function(v)  {
        this.origin.x = v;
        this.context.x = this.position.x - this.originX * this.width;
      }
    },
    
    /**
     * @property    originY
     * y座標値
     */
    originY: {
      "get": function()   { return this.origin.y; },
      "set": function(v)  {
        this.origin.y = v;
        this.context.y = this.position.y - this.originY * this.height;
      }
    },
    
    /**
     * @property    scaleX
     * スケールX値
     */
    scaleX: {
      "get": function()   { return this.scale.x; },
      "set": function(v)  {
        this.scale.x = this.context.scale.x = v;
      }
    },
    
    /**
     * @property    scaleY
     * スケールY値
     */
    scaleY: {
      "get": function()   { return this.scale.y; },
      "set": function(v)  {
        this.scale.y = this.context.scale.y = v;
      }
    },
    
    /**
     * @property    width
     * width
     */
    width: {
      "get": function()   {
        return (this.boundingType === 'rect') ?
          this._width : this._diameter;
      },
      "set": function(v)  {
        this._width = this.context.width = v; 
      }
    },
    /**
     * @property    height
     * height
     */
    height: {
      "get": function()   {
        return (this.boundingType === 'rect') ?
          this._height : this._diameter;
      },
      "set": function(v)  {
        this._height = this.context.height = v;
      }
    },

    /**
     * @property    radius
     * 半径
     */
    radius: {
      "get": function()   {
        return (this.boundingType === 'rect') ?
          (this.width+this.height)/4 : this._radius;
      },
      "set": function(v)  {
        this._radius = this.context.radius = v;
        this._diameter = v*2;
      },
    },
    
    /**
     * @property    top
     * 左
     */
    top: {
      "get": function()   { return this.y - this.height*this.originY; },
      "set": function(v)  { this.y = v + this.height*this.originY; },
    },
 
    /**
     * @property    right
     * 左
     */
    right: {
      "get": function()   { return this.x + this.width*(1-this.originX); },
      "set": function(v)  { this.x = v - this.width*(1-this.originX); },
    },
 
    /**
     * @property    bottom
     * 左
     */
    bottom: {
      "get": function()   { return this.y + this.height*(1-this.originY); },
      "set": function(v)  { this.y = v - this.height*(1-this.originY); },
    },
 
    /**
     * @property    left
     * 左
     */
    left: {
      "get": function()   { return this.x - this.width*this.originX; },
      "set": function(v)  { this.x = v + this.width*this.originX; },
    },

    /**
     * @property    centerX
     * centerX
     */
    centerX: {
      "get": function()   { return this.x + this.width/2 - this.width*this.originX; },
      "set": function(v)  {
        // TODO: どうしようかな??
      }
    },
 
    /**
     * @property    centerY
     * centerY
     */
    centerY: {
      "get": function()   { return this.y + this.height/2 - this.height*this.originY; },
      "set": function(v)  {
        // TODO: どうしようかな??
      }
    },

    interactive: {
      "get": function()   { return this.__interactive; },
      "set": function(v)  {
        this.context.interactive = v;
        this.context.buttonMode = v;
        this.__interactive = false;
      }
    },
    rotation: {
      "get": function()   { return this.__rotation; },
      "set": function(v)  {
        this.__rotation = this.context.rotation = v;
      }
    }
  },
});


