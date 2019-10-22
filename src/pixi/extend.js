
phina.namespace(function(){
  phina.asset.AssetLoader.assetLoadFunctions.$safe({
    pixiimage: function(key, path){
      var texture = phina.pixi.asset.Texture();
      var flow = texture.load(path);
      return flow;
    }
  })
})
