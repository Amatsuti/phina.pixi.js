
/**
  * @class phina.pixi.display.RectangleShape
  * @extends phina.pixi.display.Shape
  */
phina.define('phina.pixi.display.RectangleShape', {
  superClass: 'phina.pixi.display.Shape',
  init: function(options) {
    options = ({}).$safe(options, {
      backgroundColor: 'transparent',
      fill: 'blue',
      stroke: '#aaa',
      strokeWidth: 4,

      cornerRadius: 0,
    });
    this.superInit(options);

    this.cornerRadius = options.cornerRadius;
  },

  prerender: function(canvas) {
    canvas.beginPath();
    canvas.roundRect(-this.width/2, -this.height/2, this.width, this.height, this.cornerRadius);
  },

  _defined: function() {
    phina.display.Shape.watchRenderProperty.call(this, 'cornerRadius');
  },
});
