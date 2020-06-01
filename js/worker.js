(function ()
{
  self.importScripts('https://cdn.jsdelivr.net/npm/lunr@0.7.1/lunr.min.js');
  
  self.addEventListener
  (
    'message'
    , function (e)
    {
      var index = lunr(function () {
        this.field('id');
        this.field('title', { boost: 10 });
        this.field('content');
        this.field('author');
        this.field('categories');
        this.field('comments');
      });
      Object.keys(e.data).forEach(function (key) {
        index.add(Object.assign({ id: key }, e.data[key]));
      });

      self.postMessage(JSON.stringify(index.toJSON()));
    }
    , false
  );

}());
