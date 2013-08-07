(function(){
  var Serviceability, serviceability;
  Serviceability = (function(){
    Serviceability.displayName = 'Serviceability';
    var prototype = Serviceability.prototype, constructor = Serviceability;
    function Serviceability(srcAddress, $parent){
      var this$ = this;
      this.$parent = $parent;
      this.loadData(srcAddress, function(){
        return this$.computeStatistics(this$.data);
      });
    }
    prototype.loadData = function(srcAddress, cb){
      var this$ = this;
      return $.getJSON("data/" + srcAddress, function(data){
        this$.data = data;
        return cb();
      });
    };
    prototype.computeStatistics = function(data){
      var values, i$, len$, dayIndex, day, j$, len1$, dayValues;
      values = [];
      for (i$ = 0, len$ = data.length; i$ < len$; ++i$) {
        dayIndex = i$;
        day = data[i$];
        for (j$ = 0, len1$ = day.length; j$ < len1$; ++j$) {
          dayValues = day[j$];
          values.push(dayValues);
        }
      }
      return this.maxValue = Math.max.apply(Math, values);
    };
    return Serviceability;
  }());
  serviceability = new Serviceability('dailyBins_20120319.json', $(".container"));
}).call(this);
