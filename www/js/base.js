(function(){
  var binLength, maxValue, dayTexts, minuteTexts, Serviceability, formatTime, getTime;
  binLength = 600;
  maxValue = 16509;
  dayTexts = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'];
  minuteTexts = ['00', '10', '20', '30', '40', '50'];
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
      var x$, days, y$, color, z$;
      x$ = days = this.container.selectAll(".day").data(this.data).enter().append("div");
      x$.attr('class', 'day');
      y$ = x$.append("div");
      y$.attr('class', 'dayPopis');
      y$.text(function(data, index){
        return dayTexts[index];
      });
      color = d3.scale.linear().domain([0, maxValue * 0.23, maxValue]).range(['#2C7BB6', '#FFFFBF', '#D7191C']);
      z$ = days.selectAll(".bin").data(function(it){
        return it;
      }).enter().append("div");
      z$.attr('class', 'bin');
      z$.attr('data-tooltip', function(value, binIndex){
        return escape("<strong>" + getTime(binIndex) + ":</strong> <strong>" + value + "</strong> obsloužených zastávek");
      });
      z$.style('background', function(it){
        return color(it);
      });
      return z$;
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
  new Serviceability('dailyBins_20120319.json', ".container.c1");
  new Serviceability('dailyBins_20130625.json', ".container.c2");
  new Serviceability('dailyBins_20130701.json', ".container.c3");
  new Tooltip().watchElements();
}).call(this);
