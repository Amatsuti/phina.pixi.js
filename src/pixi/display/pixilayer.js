
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

