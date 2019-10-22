/* 
 * phina.pixi.js 0.1.0
 * phina.pixi.js is WebGL library.
 * MIT Licensed
 * 
 * Copyright (C) 2019 Amatsuti
 */


'use strict';

  /**
   * @class phina.asset.Texture
   * @extends phina.asset.Asset
   */
  phina.define('phina.pixi.asset.Texture', {
    superClass: "phina.asset.Asset",

    /**
     * @constructor
     */
    init: function() {
      this.superInit();
    },

    _load: function(resolve) {
      this.domElement = new Image();
      this.pixiObject = null;

      var isLocal = (location.protocol == 'file:');
      if ( !isLocal && !(/^data:/.test(this.src)) ) {
        this.domElement.crossOrigin = 'Anonymous'; // クロスオリジン解除
      }

      var self = this;
      this.domElement.onload = function(e) {
        self.loaded = true;
        self.pixiObject = PIXI.Texture.from(self.domElement);
        resolve(self);
      };
      this.domElement.onerror = function(e) {
        console.error("[phina.js] not found `{0}`!".format(this.src));

        var key = self.src.split('/').last.replace('.png', '').split('?').first.split('#').first;
        e.target.onerror = null;
        e.target.src = "http://dummyimage.com/128x128/444444/eeeeee&text=" + key;
      };

      this.domElement.src = this.src;
    },

    clone: function () {
      var image = this.domElement;
      var canvas = phina.graphics.Canvas().setSize(image.width, image.height);
      var t = phina.pixi.asset.Texture();
      canvas.context.drawImage(image, 0, 0);
      t.domElement = canvas.domElement;
      t.pixiTexture.fromLoader(this.domElement);
      return t;
    },

    // transmit: function(color) {
    //   // imagaオブジェクトをゲット
    //   var image = this.domElement;
    //   // 新規canvas作成
    //   var canvas = phina.graphics.Canvas().setSize(image.width, image.height);
    //   // 新規canvasに描画
    //   canvas.context.drawImage(image, 0, 0);
    //   // canvas全体のイメージデータ配列をゲット
    //   var imageData = canvas.context.getImageData(0, 0, canvas.width, canvas.height);
    //   var data = imageData.data;
    //   // 透過色の指定がなければ左上のrgb値を抽出
    //   var r = (color !== undefined) ? color.r : data[0];
    //   var g = (color !== undefined) ? color.g : data[1];
    //   var b = (color !== undefined) ? color.b : data[2];
    //   // 配列を4要素目から4つ飛び（アルファ値）でループ
    //   (3).step(data.length, 4, function(i) {
    //     // rgb値を逆算でゲットし、左上のrgbと比較
    //     if (data[i - 3] === r && data[i - 2] === g && data[i - 1] === b) {
    //       // 一致した場合はアルファ値を書き換える
    //       data[i] = 0;
    //     }
    //   });
    //   // 書き換えたイメージデータをcanvasに戻す
    //   canvas.context.putImageData(imageData, 0, 0);

    //   this.domElement = canvas.domElement;
    // },

    // filter: function (filters) {
    //   if (!filters) {
    //     return this;
    //   }
    //   if (!Array.isArray(filters)) {
    //     filters = [filters];
    //   }
    //   var image = this.domElement;
    //   var w = image.width;
    //   var h = image.height;
    //   var canvas = phina.graphics.Canvas().setSize(w, h);
    //   var imageData = null;

    //   canvas.context.drawImage(image, 0, 0);
    //   imageData = canvas.context.getImageData(0, 0, w, h);
    //   filters.forEach( function (fn) {
    //     if (typeof fn == 'function') {
    //       h.times( function (y) {
    //         w.times( function (x) {
    //           var i = (y * w + x) * 4;
    //           var pixel = imageData.data.slice(i, i + 4);
    //           fn(pixel, i, x, y, imageData);
    //         });
    //       });
    //     }
    //   });
    //   canvas.context.putImageData(imageData, 0, 0);
    //   this.domElement = canvas.domElement;
    //   return this;
    // },

  });


/**
 * @class phina.pixi.display.Shape
 */
phina.define('phina.pixi.Container', {
  domElement: null,
  canvas: null,
  context: null,

  /**
   * 初期化
   */
  init: function(canvas) {
    this.canvas = canvas || new PIXI.Container();

    this.domElement = this.canvas;
    this.context = this.canvas;
  },

  setSize: function(width, height) {
    this.canvas.width   = width;
    this.canvas.height  = height;
    return this;
  },

  setSizeToScreen: function(){

  },
  fitScreen: function(isEver){

  },

  _accessor:{
  },

  _static:{
    defaults:{
    }
  }

});


/**
  * @class phina.pixi.display.Label
  * @extends phina.pixi.display.Shape
  */
phina.define('phina.pixi.display.Label', {
  superClass: 'phina.pixi.display.PlainElement',

  /**
    * @constructor
    */
  init: function(options) {
    if (typeof arguments[0] !== 'object') {
      options = { text: arguments[0], };
    }
    else {
      options = arguments[0];
    }

    options = ({}).$safe(options, phina.pixi.display.Label.defaults, {canvas:phina.pixi.Container(new PIXI.Text())});

    this.superInit(options);

    this._fontStyle = this.context.style = new PIXI.TextStyle();
    this.text = options.text;
    this.fontSize = options.fontSize;
    this.fontWeight = options.fontWeight;
    this.fontFamily = options.fontFamily;
    this.align = options.align;
    this.baseline = options.baseline;
    this.lineHeight = options.lineHeight;
    this.fill = options.fill;
    this.stroke = options.stroke;
  },

  calcCanvasWidth: function() {
    var width = 0;
    var canvas = this.canvas;
    // canvas.context.font = this.font;
    this._lines.forEach(function(line) {
      var w = PIXI.TextMetrics.measureText(line, this.fontStyle).width;
      if (width < w) {
        width = w;
      }
    }, this);
    if (this.align !== 'center') width*=2;

    return width + this.padding*2;
  },

  calcCanvasHeight: function() {
    var height = this.fontSize * this._lines.length;
    if (this.baseline !== 'middle') height*=2;
    return height*this.lineHeight + this.padding*2;
  },

  prerender: function(canvas) {
    var context = canvas.fontStyle;
    context.fontFamily = this.font;
    context.fontSize = this.fontSize;
    context.fontWeight = this.fontWeight;
    // context.textAlign = this.align;
    // context.textBaseline = this.baseline;

    var lines = this._lines;
    this.lineSize = this.fontSize*this.lineHeight;
    this._offset = -Math.floor(lines.length/2)*this.lineSize;
    this._offset += ((lines.length+1)%2) * (this.lineSize/2);
  },

  _accessor: {
    /**
      * text
      */
    text: {
      get: function() { return this._text; },
      set: function(v) {
        this._text = v;
        this._lines = (this.text + '').split('\n');
      },
    },

    font: {
      get: function() {
        return "{fontWeight} {fontSize}px {fontFamily}".format(this);
      },
    },
    fontStyle:{
      get: function(){ return this._fontStyle; },
    }
  },

  _static: {
    defaults: {
      backgroundColor: 'transparent',

      fill: 'black',
      stroke: null,
      strokeWidth: 2,

      // 
      text: 'Hello, world!',
      // 
      fontSize: 32,
      fontWeight: '',
      fontFamily: "'HiraKakuProN-W3'", // Hiragino or Helvetica,
      // 
      align: 'center',
      baseline: 'middle',
      lineHeight: 1.2,
    },
  },

  _defined: function() {

    this.prototype.$watch('text', function(newVal, oldVal) {
      this.context.text = newVal;
    });
    this.prototype.$watch('fontFamily', function(newVal, oldVal) {
      this.fontStyle.fontFamily = newVal;
    });
    this.prototype.$watch('fontWeight', function(newVal, oldVal) {
      this.fontStyle.fontWeight = newVal;
    });
    this.prototype.$watch('fontSize', function(newVal, oldVal) {
      this.fontStyle.fontSize = newVal;
    });
    this.prototype.$watch('fill', function(newVal, oldVal) {
      this.fontStyle.fill = newVal;
    });
    this.prototype.$watch('stroke', function(newVal, oldVal) {
      this.fontStyle.fontSize = newVal;
    });
    // Shape.watchRenderProperty.call(this, 'align');
    // Shape.watchRenderProperty.call(this, 'baseline');
    // Shape.watchRenderProperty.call(this, 'lineHeight');
  },
});


/**
 * @class phina.display.PixiLayer
 * @extends phina.display.DisplayElement
 */
phina.define('phina.display.PixiLayer', {
  superClass: 'phina.pixi.display.PlainElement',

  /** 子供を 自分のCanvasRenderer で描画するか */
  renderChildBySelf: false,

  stage: null,
  renderer: null,

  init: function(options) {
    var canvas = new phina.pixi.Container();
    this.superInit({canvas:canvas});

    this.renderer = PIXI.autoDetectRenderer({
      width:options.width, height:options.height,
      antialias:true, transparent: true
    });

    this.on('enterframe', function() {
      this.renderer.render(canvas.context);
    });
  },

  draw: function(canvas) {
    var domElement = this.renderer.view;
    canvas.context.drawImage(domElement, 0, 0, domElement.width, domElement.height);
  },

});



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
  _static:{
    defaults:{
      width:100, height:100,
      canvas:null,
    }
  },
  _defined: function(){
    this.prototype.$watch('x', function(newVal, oldVal) {
      this.context.x = newVal;
    });
    this.prototype.$watch('y', function(newVal, oldVal) {
      this.context.y = newVal;
    });
    this.prototype.$watch('rotation', function(newVal, oldVal) {
      this.context.rotation = newVal;
    });
    this.prototype.$watch('originX', function(newVal, oldVal) {
      this.context.pivot.x = newVal * this.width;
    });
    this.prototype.$watch('originY', function(newVal, oldVal) {
      this.context.pivot.y = newVal * this.height;
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
    // this.prototype.$watch('radius', function(newVal, oldVal) {
    //   this.canvas.y = newVal;
    // });
  },
});




/**
 * @class phina.pixi.display.Shape
 */
phina.define('phina.pixi.display.Shape', {
  superClass: 'phina.pixi.display.PlainElement',
  init: function(param){
    param=(param||{}).$safe(phina.pixi.display.Shape.defaults);
    this.superInit(param);

    this.padding = param.padding;

    this.backgroundColor = param.backgroundColor;
    this.fill = param.fill;
    this.stroke = param.stroke;
    this.strokeWidth = param.strokeWidth;

    this.shadow = param.shadow;
    this.shadowBlur = param.shadowBlur;

    this.watchDraw = true;
    this._dirtyDraw = true;
      
    var checkRender = function() {
      // render
      if (this.watchDraw && this._dirtyDraw === true) {
        this.render(this.canvas);
        this._dirtyDraw = false;
      }
    };

    this.on('enterframe', checkRender);
    this.on('added', checkRender);

  },

  calcCanvasWidth: function() {
    return this.width + this.padding*2;
  },

  calcCanvasHeight: function() {
    return this.height + this.padding*2;
  },

  calcCanvasSize: function () {
    return {
      width: this.calcCanvasWidth(),
      height: this.calcCanvasHeight(),
    };
  },

  isStrokable: function() {
    return this.stroke && 0 < this.strokeWidth;
  },

  prerender: function(canvas) {

  },
  postrender: function(canvas) {

  },
  renderFill: function(canvas) {
    canvas.fill();
  },
  renderStroke: function(canvas) {
    canvas.stroke();
  },

  render: function(canvas) {
    var context = canvas;
    // リサイズ
    var size = this.calcCanvasSize();
    canvas.setSize(size.width, size.height);
    // クリアカラー
    canvas.clearColor(this.backgroundColor);
    // canvas.clear();
    // 中心に座標を移動
    canvas.transformCenter();

    // 描画前処理
    this.prerender(this.canvas);

    // ストローク描画
    if (this.isStrokable()) {
      context.strokeColor = this.stroke;
      context.strokeWidth = this.strokeWidth;
      // context.lineJoin = "round";
      // context.shadowBlur = 0;
      this.renderStroke(canvas);
    }

    // 塗りつぶし描画
    if (this.fill) {
      context.fillColor = this.fill;

      // shadow の on/off
      // if (this.shadow) {
      //   context.shadowColor = this.shadow;
      //   context.shadowBlur = this.shadowBlur;
      // }
      // else {
      //   context.shadowBlur = 0;
      // }

      this.renderFill(canvas);
    }

    // 描画後処理
    this.postrender(this.canvas);

    return this;
  },

  _static:{
    defaults:{
      width:64,
      height: 64,
      padding: 8,

      backgroundColor: 'transparent',
      fill: null,
      stroke: null,
      strokeWidth: 4,

      shadow: false,
      shadowBlur: 4,
    }
  }
});



/**
  * @class phina.display.Sprite
  * @extends phina.display.DisplayElement
  */
phina.define('phina.pixi.display.Sprite', {
  superClass: 'phina.pixi.display.PlainElement',

  init: function(image, width, height) {
    this._image = new PIXI.Sprite();
    this.superInit({canvas:phina.pixi.Container(this._image)});

    this.srcRect = new PIXI.Rectangle();
    this.setImage(image, width, height);

  },

  draw: function(canvas) {
    // var image = this.image.domElement;

    // // canvas.context.drawImage(image,
    // //   0, 0, image.width, image.height,
    // //   -this.width*this.origin.x, -this.height*this.origin.y, this.width, this.height
    // //   );

    // var srcRect = this.srcRect;
    // canvas.context.drawImage(image,
    //   srcRect.x, srcRect.y, srcRect.width, srcRect.height,
    //   -this._width*this.originX, -this._height*this.originY, this._width, this._height
    //   );
  },

  setImage: function(image, width, height) {
    if (typeof image === 'string') {
      image = phina.asset.AssetManager.get('pixiimage', image);
    }
    this._image.texture = image.pixiObject;
    this.width = this._image.texture.width;
    this.height = this._image.texture.height;

    if (width) { this.width = width; }
    if (height) { this.height = height; }

    this.frameIndex = 0;

    return this;
  },

  setFrameIndex: function(index, width, height) {
    var tw  = width || this._width;      // tw
    var th  = height || this._height;    // th
    var row = ~~(this.image.width / tw);
    var col = ~~(this.image.height / th);
    var maxIndex = row*col;
    index = index%(maxIndex||1);
    
    var x = index%(row||1);
    var y = ~~(index/row);
    this.srcRect.x = x*tw;
    this.srcRect.y = y*th;
    this.srcRect.width  = tw;
    this.srcRect.height = th;

    this._frameIndex = index;
    this._image.texture.frame = this.srcRect;

    return this;
  },

  _accessor: {
    image: {
      get: function() {return this._image.texture;},
      set: function(v) {
        this.setImage(v);
        return this;
      }
    },
    frameIndex: {
      get: function() {return this._frameIndex;},
      set: function(idx) {
        this.setFrameIndex(idx);
        return this;
      }
    },
  },
});


phina.namespace(function(){
  phina.asset.AssetLoader.assetLoadFunctions.$safe({
    pixiimage: function(key, path){
      var texture = phina.pixi.asset.Texture();
      var flow = texture.load(path);
      return flow;
    }
  })
})


/**
 * @class phina.pixi.display.Shape
 */
phina.define('phina.pixi.graphics.Canvas', {
  superClass:'phina.pixi.Container',
  domElement: null,
  canvas: null,
  context: null,

  /**
   * 初期化
   */
  init: function(canvas) {
    this.superInit(canvas || new PIXI.Graphics());

    this._strokeStyle = this.context.line;
    this._fillStyle = this.context.fill;
    this._fontStyle = new PIXI.TextStyle();
  },

  clear: function(x,y, width,height){
    this.context.clear(); //TODO 選択領域だけ消す
    return this;
  },

  clearColor: function(fillStyle, x,y, width,height){
    x = x || 0;
    y = y || 0;
    width = width || this.width;
    height= height|| this.height;
    this.context.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
    if(fillStyle == 'transparent'){
      this.context.beginFill(0,0.0);
    }else{
      this.context.beginFill(fillStyle);
    }
    this.context.drawRect(x, y, width, height);
    this.context.endFill();
    return this;
  },

  beginPath: function(){
    var fill = this._fillStyle;
    var line = this._strokeStyle;
    this.context.beginFill(fill.color, fill.alpha);
    this.context.lineStyle(line.width, line.color, line.alpha);
    return this;
  },
  closePath: function(){
    this.context.closePath();
    return this;
  },

  /**
   *  新規パス生成
   */
  moveTo: function(x, y) {
    this.context.moveTo(x, y);
    return this;
  },

  /**
   * パスに追加
   */
  lineTo: function(x, y) {
    this.context.lineTo(x, y);
    return this;
  },


  quadraticCurveTo: function() {
    this.context.quadraticCurveTo.apply(this.context, arguments);
    return this;
  },

  bezierCurveTo: function() {
    this.context.bezierCurveTo.apply(this.context, arguments);
    return this;
  },

  /**
   * パス内を塗りつぶす
   */
  fill: function(){
    this.context.endFill();
    return this;
  },

  /**
   * パス上にラインを引く
   */
  stroke: function() {
    // this.context.stroke();
    return this;
  },


  /**
   * クリップ
   */
  clip: function(mask) {
    this.context.mask = mask;
    return this;
  },

      
  /**
   * 点描画
   */
  drawPoint: function(x, y) {
    return this.strokeRect(x, y, 1, 1);
  },

  /**
   * ラインパスを作成
   */
  line: function(x0, y0, x1, y1) {
    return this.moveTo(x0, y0).lineTo(x1, y1);
  },
  
  /**
   * ラインを描画
   */
  drawLine: function(x0, y0, x1, y1) {
    return this.beginPath().line(x0, y0, x1, y1).stroke();
  },

  /**
   * ダッシュラインを描画
   */
  drawDashLine: function(x0, y0, x1, y1, pattern) {
    var patternTable = null;
    if (typeof(pattern) == "string") {
      patternTable = pattern;
    }
    else {
      pattern = pattern || 0xf0f0;
      patternTable = pattern.toString(2);
    }
    patternTable = patternTable.padding(16, '1');
    
    var vx = x1-x0;
    var vy = y1-y0;
    var len = Math.sqrt(vx*vx + vy*vy);
    vx/=len; vy/=len;
    
    var x = x0;
    var y = y0;
    for (var i=0; i<len; ++i) {
      if (patternTable[i%16] == '1') {
        this.drawPoint(x, y);
        // this.fillRect(x, y, this.context.lineWidth, this.context.lineWidth);
      }
      x += vx;
      y += vy;
    }
    
    return this;
  },

  /**
   * v0(x0, y0), v1(x1, y1) から角度を求めて矢印を描画
   * http://hakuhin.jp/as/rotation.html
   */
  drawArrow: function(x0, y0, x1, y1, arrowRadius) {
    var vx = x1-x0;
    var vy = y1-y0;
    var angle = Math.atan2(vy, vx)*180/Math.PI;
    
    this.drawLine(x0, y0, x1, y1);
    this.fillPolygon(x1, y1, arrowRadius || 5, 3, angle);
    
    return this;
  },


  /**
   * lines
   */
  lines: function() {
    this.moveTo(arguments[0], arguments[1]);
    for (var i=1,len=arguments.length/2; i<len; ++i) {
      this.lineTo(arguments[i*2], arguments[i*2+1]);
    }
    return this;
  },

  /**
   * ラインストローク描画
   */
  strokeLines: function() {
    this.beginPath();
    this.lines.apply(this, arguments);
    this.stroke();
    return this;
  },

  /**
   * ライン塗りつぶし描画
   */
  fillLines: function() {
    this.beginPath();
    this.lines.apply(this, arguments);
    this.fill();
    return this;
  },
  
  /**
   * 四角形パスを作成する
   */
  rect: function(x, y, width, height) {
    // this.context.drawRect.apply(this.context, arguments);
    return this;
  },
  
  /**
   * 四角形塗りつぶし描画
   */
  fillRect: function() {
    this.context.drawRect.apply(this.context, arguments);
    this.context.endFill();
    return this;
  },
  
  /**
   * 四角形ライン描画
   */
  strokeRect: function() {
    this.context.drawRect.apply(this.context, arguments);
    return this;
  },
  
  /**
   * 角丸四角形パス
   */
  roundRect: function(x, y, width, height, radius) {
    var l = x + radius;
    var r = x + width - radius;
    var t = y + radius;
    var b = y + height - radius;
    
    /*
    var ctx = this.context;
    ctx.moveTo(l, y);
    ctx.lineTo(r, y);
    ctx.quadraticCurveTo(x+width, y, x+width, t);
    ctx.lineTo(x+width, b);
    ctx.quadraticCurveTo(x+width, y+height, r, y+height);
    ctx.lineTo(l, y+height);
    ctx.quadraticCurveTo(x, y+height, x, b);
    ctx.lineTo(x, t);
    ctx.quadraticCurveTo(x, y, l, y);
    /**/
    
    this.context.arc(l, t, radius,     -Math.PI, -Math.PI*0.5, false);  // 左上
    this.context.arc(r, t, radius, -Math.PI*0.5,            0, false);  // 右上
    this.context.arc(r, b, radius,            0,  Math.PI*0.5, false);  // 右下
    this.context.arc(l, b, radius,  Math.PI*0.5,      Math.PI, false);  // 左下
    this.closePath();
    
    return this;
  },

  /**
   * 角丸四角形塗りつぶし
   */
  fillRoundRect: function(x, y, width, height, radius) {
    return this.beginPath().roundRect(x, y, width, height, radius).fill();
  },

  /**
   * 角丸四角形ストローク描画
   */
  strokeRoundRect: function(x, y, width, height, radius) {
    return this.beginPath().roundRect(x, y, width, height, radius).stroke();
  },

  /**
   * 円のパスを設定
   */
  circle: function(x, y, radius) {
    this.context.arc(x, y, radius, 0, Math.PI*2, false);
    return this;
  },
  
  /**
   * 塗りつぶし円を描画
   */
  fillCircle: function(x, y, radius) {
    var c = this.context;
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI*2, false);
    c.closePath();
    c.fill();
    return this;
  },
  
  /**
   * ストローク円を描画
   */
  strokeCircle: function(x, y, radius) {
    var c = this.context;
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI*2, false);
    c.closePath();
    c.stroke();
    return this;
  },

  /**
   * 円弧のパスを設定
   */
  arc: function(x, y, radius, startAngle, endAngle, anticlockwise) {
    this.context.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    return this;
  },
  
  /**
   * 塗りつぶし円弧を描画
   */
  fillArc: function(x, y, radius, startAngle, endAngle, anticlockwise) {
    return this.beginPath().arc(x, y, radius, startAngle, endAngle, anticlockwise).fill();
  },
  
  /**
   * ストローク円弧を描画
   */
  strokeArc: function(x, y, radius, startAngle, endAngle, anticlockwise) {
    return this.beginPath().arc(x, y, radius, startAngle, endAngle, anticlockwise).stroke();
  },


  pie: function(x, y, radius, startAngle, endAngle, anticlockwise) {
    var context = this.context;
    this.beginPath();
    context.moveTo(0, 0);
    context.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    this.closePath();
    return this;
  },
  fillPie: function(x, y, radius, startAngle, endAngle, anticlockwise) {
    return this.beginPath().pie(x, y, radius, startAngle, endAngle, anticlockwise).fill();
  },
  strokePie: function(x, y, radius, startAngle, endAngle, anticlockwise) {
    return this.beginPath().pie(x, y, radius, startAngle, endAngle, anticlockwise).stroke();
  },

  
  /**
   * ポリゴンパス
   */
  polygon: function(x, y, size, sides, offsetAngle) {
    var radDiv = (Math.PI*2)/sides;
    var radOffset = (offsetAngle!==undefined) ? offsetAngle*Math.PI/180 : -Math.PI/2;
    
    this.moveTo(x + Math.cos(radOffset)*size, y + Math.sin(radOffset)*size);
    for (var i=1; i<sides; ++i) {
      var rad = radDiv*i+radOffset;
      this.lineTo(
        x + Math.cos(rad)*size,
        y + Math.sin(rad)*size
      );
    }
    this.closePath();
    return this;
  },
  /**
   * ポリゴン塗りつぶし
   */
  fillPolygon: function(x, y, radius, sides, offsetAngle) {
    return this.beginPath().polygon(x, y, radius, sides, offsetAngle).fill();
  },
  /**
   * ポリゴンストローク描画
   */
  strokePolygon: function(x, y, radius, sides, offsetAngle) {
    return this.beginPath().polygon(x, y, radius, sides, offsetAngle).stroke();
  },
  
  /**
   * star
   */
  star: function(x, y, radius, sides, sideIndent, offsetAngle) {
    var x = x || 0;
    var y = y || 0;
    var radius = radius || 64;
    var sides = sides || 5;
    var sideIndentRadius = radius * (sideIndent || 0.38);
    var radOffset = (offsetAngle) ? offsetAngle*Math.PI/180 : -Math.PI/2;
    var radDiv = (Math.PI*2)/sides/2;

    this.moveTo(
      x + Math.cos(radOffset)*radius,
      y + Math.sin(radOffset)*radius
    );
    for (var i=1; i<sides*2; ++i) {
      var rad = radDiv*i + radOffset;
      var len = (i%2) ? sideIndentRadius : radius;
      this.lineTo(
        x + Math.cos(rad)*len,
        y + Math.sin(rad)*len
      );
    }
    this.closePath();

    return this;
  },

  /**
   * 星を塗りつぶし描画
   */
  fillStar: function(x, y, radius, sides, sideIndent, offsetAngle) {
    this.beginPath().star(x, y, radius, sides, sideIndent, offsetAngle).fill();
    return this;
  },

  /**
   * 星をストローク描画
   */
  strokeStar: function(x, y, radius, sides, sideIndent, offsetAngle) {
    this.beginPath().star(x, y, radius, sides, sideIndent, offsetAngle).stroke();
    return this;
  },

  /*
    * heart
    */
  heart: function(x, y, radius, angle) {
    var half_radius = radius*0.5;
    var rad = (angle === undefined) ? Math.PI/4 : Math.degToRad(angle);

    // 半径 half_radius の角度 angle 上の点との接線を求める
    var p = Math.cos(rad)*half_radius;
    var q = Math.sin(rad)*half_radius;

    // 円の接線の方程式 px + qy = r^2 より y = (r^2-px)/q
    var x2 = -half_radius;
    var y2 = (half_radius*half_radius-p*x2)/q;

    // 中心位置調整
    var height = y2 + half_radius;
    var offsetY = half_radius-height/2;

    // パスをセット
    this.moveTo(0+x, y2+y+offsetY);

    this.arc(-half_radius+x, 0+y+offsetY, half_radius, Math.PI-rad, Math.PI*2);
    this.arc(half_radius+x, 0+y+offsetY, half_radius, Math.PI, rad);
    this.closePath();

    return this;
  },

  /*
    * fill heart
    */
  fillHeart: function(x, y, radius, angle) {
    return this.beginPath().heart(x, y, radius, angle).fill();
  },

  /*
    * stroke heart
    */
  strokeHeart: function(x, y, radius, angle) {
    return this.beginPath().heart(x, y, radius, angle).stroke();
  },

  /*
    * http://stackoverflow.com/questions/14169234/the-relation-of-the-bezier-curve-and-ellipse
    */
  ellipse: function(x, y, w, h) {
    var ctx = this.context;
    var kappa = 0.5522848;

    var ox = (w / 2) * kappa; // control point offset horizontal
    var oy = (h / 2) * kappa; // control point offset vertical
    var xe = x + w;           // x-end
    var ye = y + h;           // y-end
    var xm = x + w / 2;       // x-middle
    var ym = y + h / 2;       // y-middle

    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    // ctx.closePath();

    return this;
  },

  fillEllipse: function(x, y, width, height) {
    return this.beginPath().ellipse(x, y, width, height).fill();
  },
  strokeEllipse: function(x, y, width, height) {
    return this.beginPath().ellipse(x, y, width, height).stroke();
  },

  fillText: function(text, x, y, maxWidth) {
    var text = new PIXI.Text(text, new PIXI.TextStyle({
      fill: this._fillStyle.color,
      stroke: this._strokeStyle.color,
      wordWrap: !!maxWidth,
      wordWrapWidth: maxWidth,
    }));
    this.context.addChild(text);
    return this;
  },

  strokeText: function() {
    var text = new PIXI.Text(text, new PIXI.TextStyle({
      fill: 'transparent',
      stroke: this._strokeStyle.color,
      wordWrap: !!maxWidth,
      wordWrapWidth: maxWidth,
    }));
    this.context.addChild(text);
    return this;
  },

  /*
    * 画像を描画
    */
  drawImage: function(image,dx,dy,dw,dh) {
    var img = PIXI.Sprite.from(image.src);
    img.x = dx; img.y = dy;
    img.width = dw; img.height = dh;
    this.context.addChild(img);
    return this;
  },

  /**
   * 行列をセット
   */
  setTransform: function(m11, m12, m21, m22, dx, dy) {
    this.context.setTransform(dx, dy, m11, m22, 0, m21, m12);
    return this;
  },

  /**
   * 行列をリセット
   */
  resetTransform: function() {
    this.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
    return this;
  },
  /**
   * 中心に移動
   */
  transformCenter: function() {
    this.setTransform(1, 0, 0, 1, this.width/2, this.height/2);
    return this;
  },

  /**
   * 移動
   */
  translate: function(x, y) {
    this.context.moveTo(x, y);
    return this;
  },
  
  /**
   * 回転
   */
  rotate: function(rotation) {
    this.context.rotation = rotation;
    return this;
  },
  
  /**
   * スケール
   */
  scale: function(scaleX, scaleY) {
    this.context.scale.x = scaleX || this.context.scale.x;
    this.context.scale.y = scaleY || this.context.scale.y;
    return this;
  },

  /**
   * 状態を保存
   */
  save: function() {
    // this.context.save();
    return this;
  },

  /**
   * 状態を復元
   */
  restore: function() {
    // this.context.restore();
    return this;
  },

  // /**
  //  * 画像として保存
  //  */
  // saveAsImage: function(mime_type) {
  //   mime_type = mime_type || "image/png";
  //   var data_url = this.canvas.toDataURL(mime_type);
  //   // data_url = data_url.replace(mime_type, "image/octet-stream");
  //   window.open(data_url, "save");
    
  //   // toDataURL を使えば下記のようなツールが作れるかも!!
  //   // TODO: プログラムで絵をかいて保存できるツール
  // },

  _accessor:{
    fontStyle:{
      get: function(){ return this._fontStyle; },
    }
  },

  _static:{
    defaults:{
    }
  },

});


