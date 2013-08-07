(function(){
  var Serviceability, serviceability;
  Serviceability = (function(){
    Serviceability.displayName = 'Serviceability';
    var prototype = Serviceability.prototype, constructor = Serviceability;
    function Serviceability(srcAddress, parentSelector){
      var this$ = this;
      this.container = d3.select(parentSelector);
      this.loadData(srcAddress, function(){
        this$.computeStatistics(this$.data);
        return this$.draw();
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
    prototype.draw = function(){
      var x$, days;
      x$ = days = this.container.selectAll(".day").data(this.data).enter().append("div");
      x$.attr('class', 'day');
      return x$;
    };
    return Serviceability;
  }());
  serviceability = new Serviceability('dailyBins_20120319.json', ".container");
}).call(this);
