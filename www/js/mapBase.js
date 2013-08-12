(function(){
  var x$, this$ = this;
  window.map = L.map('map', {
    fadeAnimation: false,
    minZoom: 6,
    maxZoom: 14
  });
  x$ = map;
  x$.setView([50.08, 14.4], 12);
  x$.addLayer(L.tileLayer("http://service.ihned.cz/tiles/urban/{z}/{x}/{y}.png", {
    zIndex: 1,
    attribution: '<a target="_blank" href="http://creativecommons.org/licenses/by-nc-sa/3.0/cz/" target = "_blank">CC BY-NC-SA 3.0 CZ</a> IHNED.cz, mapové data &copy; <a target="_blank" href="http://www.openstreetmap.org">OpenStreetMap.org</a>, <a target="_blank" href="http://www.infoprovsechny.cz/request/aktuln_verze_gtfs#incoming-988">dopravní data</a> <a target="_blank" href="http://dpp.cz">DPP Praha</a>'
  }));
  $.getJSON('./data/stationCoordinates.json', function(stationCoordinates){
    return $.getJSON('./data/stopDifferences.json', function(stopDifferences){
      var color;
      color = d3.scale.linear().domain([-2000, 0, 2000]).range(['#D7191C', '#FFFFBF', '#1A9641']);
      window.stationCoordinates = stationCoordinates;
      return stationCoordinates.forEach(function(coord, id){
        var diff, markerColor, icon, x$;
        if (coord) {
          diff = stopDifferences[id];
          markerColor = color(diff);
          icon = L.divIcon({
            html: "<div style='background: " + markerColor + "'></div>",
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
  });
}).call(this);
