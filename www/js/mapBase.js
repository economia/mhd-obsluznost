(function(){
  var x$, loadData, this$ = this;
  window.map = L.map('map', {
    fadeAnimation: false,
    minZoom: 6,
    maxZoom: 14,
    maxBounds: [[50.356, 14.128], [49.693, 15.381]]
  });
  x$ = map;
  x$.setView([50.08, 14.4], 12);
  x$.addLayer(L.tileLayer("http://service.ihned.cz/tiles/urban/{z}/{x}/{y}.png", {
    zIndex: 1,
    attribution: '<a target="_blank" href="http://creativecommons.org/licenses/by-nc-sa/3.0/cz/" target = "_blank">CC BY-NC-SA 3.0 CZ</a> IHNED.cz, mapové data &copy; <a target="_blank" href="http://www.openstreetmap.org">OpenStreetMap.org</a>, <a target="_blank" href="http://www.infoprovsechny.cz/request/aktuln_verze_gtfs#incoming-988">dopravní data</a> <a target="_blank" href="http://dpp.cz">DPP Praha</a>'
  }));
  loadData = function(src, cb){
    var this$ = this;
    return $.getJSON(src, function(stationCoordinates){
      return cb(null, stationCoordinates);
    });
  };
  async.map(['./data/stationCoordinates.json', './data/stopDifferences.json', './data/stationNames.json'], loadData, function(err, arg$){
    var stationCoordinates, stopDifferences, stationNames, color;
    stationCoordinates = arg$[0], stopDifferences = arg$[1], stationNames = arg$[2];
    color = d3.scale.linear().domain([-2000, -100, 0, 100, 2000]).range(['#D7191C', '#FDAE61', '#FFFFBF', '#A6D96A', '#1A9641']);
    window.stationCoordinates = stationCoordinates;
    return stationCoordinates.forEach(function(coord, id){
      var diff, markerColor, title, dir, icon, x$;
      if (coord) {
        diff = stopDifferences[id];
        markerColor = color(diff);
        title = diff !== 0 ? (dir = diff > 0 ? "více" : "méně", "o " + Math.abs(diff) + " " + dir + " spojení") : "žádná změna";
        icon = L.divIcon({
          html: "<span style='background: " + markerColor + "' title='" + stationNames[id] + ": " + title + "'></span>",
          iconSize: [15, 15],
          className: "station-marker"
        });
        x$ = new L.marker(coord, {
          icon: icon
        });
        x$.addTo(map);
        return x$;
      }
    });
  });
}).call(this);
