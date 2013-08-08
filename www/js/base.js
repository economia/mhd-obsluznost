(function(){
  var binLength, maxValue, midTonePositions, dayTexts, minuteTexts, hoursTexts, Serviceability, formatTime, getTime;
  binLength = 600;
  maxValue = 9787;
  midTonePositions = [0.2, 0.35];
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
      var x$, hourMarks, y$, z$, z1$, days, z2$, color, z3$, z4$, z5$, z6$;
      x$ = hourMarks = this.container.append("div").attr("class", "hourMarks");
      y$ = x$.selectAll("hourMark").data(hoursTexts).enter().append("div");
      y$.attr("class", 'hourMark');
      y$.text(function(it){
        return it;
      });
      z$ = x$.append("div");
      z$.attr('class', "legend");
      z$.text("Hodiny");
      z1$ = days = this.container.selectAll(".day").data(this.data).enter().append("div");
      z1$.attr('class', 'day');
      z2$ = z1$.append("div");
      z2$.attr('class', 'dayMark');
      z2$.text(function(data, index){
        return dayTexts[index];
      });
      color = d3.scale.linear().domain([0, maxValue * midTonePositions[0], maxValue * midTonePositions[1], maxValue]).range(['#2C7BB6', '#ABD9E9', '#FDAE61', '#D7191C']);
      z3$ = days.selectAll(".bin").data(function(it){
        return it;
      }).enter().append("div");
      z3$.attr('class', 'bin');
      z3$.attr('data-tooltip', function(value, binIndex){
        return escape("<strong>" + getTime(binIndex) + ":</strong> <strong>" + value + "</strong> obsloužených zastávek");
      });
      z3$.style('background', function(it){
        return color(it);
      });
      z4$ = days.append("div").attr("class", "minuteMarks");
      z5$ = z4$.selectAll(".minuteMark").data(minuteTexts).enter().append('div');
      z5$.attr('class', 'minuteMark');
      z5$.text(function(it){
        return it;
      });
      z6$ = z4$.append("div");
      z6$.attr('class', "legend");
      z6$.text("minuty");
      return z4$;
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
  new Serviceability('dailyBins_20130705.json', ".container.c3");
  new Tooltip().watchElements();
}).call(this);
