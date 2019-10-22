
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


