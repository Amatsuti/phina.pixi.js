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
