
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
    canvas.clear();
    canvas.clearColor(this.backgroundColor);
    // 中心に座標を移動
    canvas.transformCenter();

    context.fillStyle.color = this.fill;
    context.strokeStyle.color = this.stroke;
    context.strokeStyle.width = this.strokeWidth;

    // 描画前処理
    this.prerender(this.canvas);

    // 塗りつぶし描画
    if (this.fill && this.fill != 'transparent') {

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

    // ストローク描画
    if (this.isStrokable()) {
      // context.lineJoin = "round";
      // context.shadowBlur = 0;
      this.renderStroke(canvas); //現状無意味
    }

    // 描画後処理
    this.postrender(this.canvas);

    return this;
  },

  _accessor: {
    fill:{
      get: function(){ return this._fill; },
      set: function(v){
        this._fill = v;
        return this;
      }
    },
    stroke:{
      get: function(){ return this._stroke; },
      set: function(v){
        this._stroke = v;
        return this;
      }
    },
    strokeWidth:{
      get: function(){ return this._strokeWidth; },
      set: function(v){
        this._strokeWidth = v;
        return this;
      }
    },
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
  },
});


