
/**
  * @class phina.pixi.display.CircleShape
  * @extends phina.pixi.display.Shape
  */
phina.define('phina.pixi.display.CircleShape', {
  superClass: 'phina.pixi.display.Shape',

  init: function(options) {
    options = ({}).$safe(options, {
      backgroundColor: 'transparent',
      fill: 'red',
      stroke: '#aaa',
      strokeWidth: 4,
      radius: 32,
    });
    this.superInit(options);

    this.setBoundingType('circle');
  },

  prerender: function(canvas) {
    canvas.beginPath();
    canvas.circle(0, 0, this.radius);
  },
});
