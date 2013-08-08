(function(){
  var binLength, maxValue, midTonePositions, dayTexts, minuteTexts, hoursTexts, GraphDrawer, Serviceability, ServiceabilityDifference, formatTime, getTime;
  binLength = 600;
  maxValue = 9787;
  midTonePositions = [0.2, 0.35];
  dayTexts = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'];
  minuteTexts = ['10', '30', '50'];
  hoursTexts = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
  GraphDrawer = {
    draw: function(){
      var x$, hourMarks, y$, z$, z1$, days, z2$, z3$, z4$, z5$, z6$, this$ = this;
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
      z3$ = days.selectAll(".bin").data(function(it){
        return it;
      }).enter().append("div");
      z3$.attr('class', 'bin');
      z3$.attr('data-tooltip', this.getTooltipText);
      z3$.style('background', function(it){
        return this$.color(it);
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
    }
  };
  window.Serviceability = Serviceability = (function(){
    Serviceability.displayName = 'Serviceability';
    var prototype = Serviceability.prototype, constructor = Serviceability;
    importAll$(prototype, arguments[0]);
    function Serviceability(parentSelector, data){
      this.data = data;
      this.container = d3.select(parentSelector);
      this.color = d3.scale.linear().domain([0, maxValue * midTonePositions[0], maxValue * midTonePositions[1], maxValue]).range(['#2C7BB6', '#ABD9E9', '#FDAE61', '#D7191C']);
      this.draw();
    }
    prototype.getTooltipText = function(value, binIndex){
      return escape("<strong>" + getTime(binIndex) + ":</strong> <strong>" + value + "</strong> obsloužených zastávek");
    };
    return Serviceability;
  }(GraphDrawer));
  window.ServiceabilityDifference = ServiceabilityDifference = (function(){
    ServiceabilityDifference.displayName = 'ServiceabilityDifference';
    var prototype = ServiceabilityDifference.prototype, constructor = ServiceabilityDifference;
    importAll$(prototype, arguments[0]);
    function ServiceabilityDifference(parentSelector, dataA, dataB){
      this.container = d3.select(parentSelector);
      this.data = this.computeDifference(dataA, dataB);
      this.color = d3.scale.linear().domain([-2200, 0, 560]).range(['#D7191C', '#FFFFBF', '#1A9641']);
      this.draw();
    }
    prototype.getTooltipText = function(value, binIndex){
      var direction;
      direction = value > 0 ? "více" : "méně";
      return escape("<strong>" + getTime(binIndex) + ":</strong> o <strong>" + Math.abs(value) + "</strong> " + direction + " obsloužených zastávek");
    };
    prototype.computeDifference = function(dataA, dataB){
      var data, i$, len$, dayId, day, j$, len1$, hourId, value;
      data = [];
      for (i$ = 0, len$ = dataA.length; i$ < len$; ++i$) {
        dayId = i$;
        day = dataA[i$];
        data[dayId] = [];
        for (j$ = 0, len1$ = day.length; j$ < len1$; ++j$) {
          hourId = j$;
          value = day[j$];
          data[dayId][hourId] = dataB[dayId][hourId] - dataA[dayId][hourId];
        }
      }
      return data;
    };
    return ServiceabilityDifference;
  }(GraphDrawer));
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
  window.loadData = function(source, cb){
    var this$ = this;
    return $.getJSON("data/" + source, function(data){
      return cb(null, data);
    });
  };
  function importAll$(obj, src){
    for (var key in src) obj[key] = src[key];
    return obj;
  }
}).call(this);
