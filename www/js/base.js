(function(){
  var binLength, maxValue, midTonePositions, dayTexts, minuteTexts, hoursTexts, GraphDrawer, Serviceability, formatTime, getTime, loadData, sources, this$ = this;
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
      z3$.attr('data-tooltip', function(value, binIndex){
        return escape("<strong>" + getTime(binIndex) + ":</strong> <strong>" + value + "</strong> obsloužených zastávek");
      });
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
  Serviceability = (function(){
    Serviceability.displayName = 'Serviceability';
    var prototype = Serviceability.prototype, constructor = Serviceability;
    importAll$(prototype, arguments[0]);
    function Serviceability(parentSelector, data){
      this.data = data;
      this.container = d3.select(parentSelector);
      this.color = d3.scale.linear().domain([0, maxValue * midTonePositions[0], maxValue * midTonePositions[1], maxValue]).range(['#2C7BB6', '#ABD9E9', '#FDAE61', '#D7191C']);
      this.draw();
    }
    return Serviceability;
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
  d3.selectAll(".fallback").remove();
  loadData = function(source, cb){
    var this$ = this;
    return $.getJSON("data/" + source, function(data){
      return cb(null, data);
    });
  };
  sources = ['dailyBins_20120319.json', 'dailyBins_20130625.json', 'dailyBins_20130705.json'];
  async.map(sources, loadData, function(err, data){
    new Serviceability(".container.c1", data[0]);
    new Serviceability(".container.c2", data[1]);
    new Serviceability(".container.c3", data[2]);
    return new Tooltip().watchElements();
  });
  function importAll$(obj, src){
    for (var key in src) obj[key] = src[key];
    return obj;
  }
}).call(this);
