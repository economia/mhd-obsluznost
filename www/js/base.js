(function(){
  var binLength, Serviceability, formatTime, getTime, serviceability;
  binLength = 600;
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
      color = d3.scale.linear().domain([0, this.maxValue * 0.28, this.maxValue]).range(['#2C7BB6', '#FFFFBF', '#D7191C']);
      y$ = days.selectAll(".bin").data(function(it){
        return it;
      }).enter().append("div");
      y$.attr('class', 'bin');
      y$.attr('data-tooltip', function(value, binIndex){
        return escape("<strong>" + getTime(binIndex) + ":</strong> <strong>" + value + "</strong> obsloužených zastávek");
      });
      y$.style('background', function(it){
        return color(it);
      });
      return y$;
    };
    return Serviceability;
  }());
  formatTime = function(seconds){
    var hours, minutes;
    hours = Math.floor(seconds / 3600) + "";
    minutes = Math.floor(seconds % 3600 / 60) + "";
    while (hours.length < 2) {
      hours = "0" + hours;
    }
    while (minutes.length < 2) {
      minutes = "0" + minutes;
    }
    return hours + ":" + minutes;
  };
  getTime = function(binIndex){
    var seconds;
    seconds = binIndex * binLength;
    return formatTime(seconds) + " - " + formatTime(seconds + binLength);
  };
  serviceability = new Serviceability('dailyBins_20120319.json', ".container");
  new Tooltip().watchElements();
}).call(this);
