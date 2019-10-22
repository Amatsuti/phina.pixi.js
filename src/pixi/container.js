
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
