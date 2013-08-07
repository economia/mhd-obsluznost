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
      var x$, days, color, y$;
      x$ = days = this.container.selectAll(".day").data(this.data).enter().append("div");
      x$.attr('class', 'day');
      color = d3.scale.linear().domain([0, this.maxValue * 0.25, this.maxValue * 0.5, this.maxValue * 0.75, this.maxValue]).range(['#FEF0D9', '#FDCC8A', '#FC8D59', '#E34A33', '#B30000']);
      y$ = days.selectAll(".bin").data(function(it){
        return it;
      }).enter().append("div");
      y$.attr('class', 'bin');
      y$.style('background', function(it){
        return color(it);
      });
      return y$;
    };
    return Serviceability;
  }());
  serviceability = new Serviceability('dailyBins_20120319.json', ".container");
}).call(this);
