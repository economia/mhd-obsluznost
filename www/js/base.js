(function(){
  var binLength, maxValue, dayTexts, minuteTexts, hoursTexts, Serviceability, formatTime, getTime;
  binLength = 600;
  maxValue = 16509;
  dayTexts = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'];
  minuteTexts = ['10', '30', '50'];
  hoursTexts = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
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
      var x$, hourMarks, y$, days, z$, color, z1$, z2$;
      x$ = hourMarks = this.container.append("div").attr("class", "hourMarks").selectAll("hourMark").data(hoursTexts).enter().append("div");
      x$.attr("class", 'hourMark');
      x$.text(function(it){
        return it;
      });
      y$ = days = this.container.selectAll(".day").data(this.data).enter().append("div");
      y$.attr('class', 'day');
      z$ = y$.append("div");
      z$.attr('class', 'dayMark');
      z$.text(function(data, index){
        return dayTexts[index];
      });
      color = d3.scale.linear().domain([0, maxValue * 0.23, maxValue]).range(['#2C7BB6', '#FFFFBF', '#D7191C']);
      z1$ = days.selectAll(".bin").data(function(it){
        return it;
      }).enter().append("div");
      z1$.attr('class', 'bin');
      z1$.attr('data-tooltip', function(value, binIndex){
        return escape("<strong>" + getTime(binIndex) + ":</strong> <strong>" + value + "</strong> obsloužených zastávek");
      });
      z1$.style('background', function(it){
        return color(it);
      });
      z2$ = days.append("div").attr("class", "minuteMarks").selectAll(".minuteMark").data(minuteTexts).enter().append('div');
      z2$.attr('class', 'minuteMark');
      z2$.text(function(it){
        return it;
      });
      return z2$;
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
  d3.selectAll(".fallback").remove();
  new Serviceability('dailyBins_20120319.json', ".container.c1");
  new Serviceability('dailyBins_20130625.json', ".container.c2");
  new Serviceability('dailyBins_20130701.json', ".container.c3");
  new Tooltip().watchElements();
}).call(this);
