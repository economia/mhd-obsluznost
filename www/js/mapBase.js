(function(){
  var x$, this$ = this;
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
  $.getJSON('./data/stationCoordinates.json', function(stationCoordinates){
    return window.stationCoordinates = stationCoordinates;
  });
}).call(this);
