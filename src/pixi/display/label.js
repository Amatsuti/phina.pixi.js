
/**
  * @class phina.pixi.display.Label
  * @extends phina.pixi.display.Shape
  */
phina.define('phina.pixi.display.Label', {
  superClass: 'phina.pixi.display.Shape',

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
    this._fontStyle = new PIXI.TextStyle();

    this.superInit(options);

    this.context.style = this._fontStyle;
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
    var width = PIXI.TextMetrics.measureText(this.text, this.fontStyle).width;
    if (this.align !== 'center') width*=2;
    return width + this.padding*2;
  },

  calcCanvasHeight: function() {
    var height = PIXI.TextMetrics.measureText(this.text, this.fontStyle).height;
    if (this.baseline !== 'middle') height*=2;
    return height + this.padding*2;
  },

  calcCanvasSize: function () {
    return {
      width: this.calcCanvasWidth(),
      height: this.calcCanvasHeight(),
    };
  },

  render: function(canvas) {
    var context = this.fontStyle;

    // context.fontFamily = this.font;
    // context.fontSize = this.fontSize;
    // context.fontWeight = this.fontWeight;
    // context.textAlign = this.align;
    // context.textBaseline = this.baseline;

    // リサイズ
    var size = this.calcCanvasSize();
    canvas.setSize(size.width, size.height);

    // var lines = this._lines;
    // this.lineSize = this.fontSize*this.lineHeight;
    // this._offset = -Math.floor(lines.length/2)*this.lineSize;
    // this._offset += ((lines.length+1)%2) * (this.lineSize/2);
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
      this.fontStyle.stroke = newVal;
    });
    // Shape.watchRenderProperty.call(this, 'align');
    // Shape.watchRenderProperty.call(this, 'baseline');
    // Shape.watchRenderProperty.call(this, 'lineHeight');
  },
});
