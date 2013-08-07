(function(){
  var Serviceability, serviceability;
  Serviceability = (function(){
    Serviceability.displayName = 'Serviceability';
    var prototype = Serviceability.prototype, constructor = Serviceability;
    function Serviceability(srcAddress, $parent){
      var this$ = this;
      this.$parent = $parent;
      this.loadData(srcAddress, function(){});
    }
    prototype.loadData = function(srcAddress, cb){
      var this$ = this;
      return $.getJSON("data/" + srcAddress, function(data){
        this$.data = data;
        return cb();
      });
    };
    return Serviceability;
  }());
  serviceability = new Serviceability('dailyBins_20120319.json', $(".container"));
}).call(this);
