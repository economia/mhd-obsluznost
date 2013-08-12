window.map = L.map do
    *   'map'
    *   fadeAnimation: false,
        minZoom: 6,
        maxZoom: 14
        # maxBounds: [[50.356 14.128], [49.693 15.381]]
map
    ..setView [50.08, 14.4], 12
    ..addLayer L.tileLayer do
        "http://service.ihned.cz/tiles/urban/{z}/{x}/{y}.png"
        zIndex: 1 attribution: '<a target="_blank" href="http://creativecommons.org/licenses/by-nc-sa/3.0/cz/" target = "_blank">CC BY-NC-SA 3.0 CZ</a> IHNED.cz, mapové data &copy; <a target="_blank" href="http://www.openstreetmap.org">OpenStreetMap.org</a>, <a target="_blank" href="http://www.infoprovsechny.cz/request/aktuln_verze_gtfs#incoming-988">dopravní data</a> <a target="_blank" href="http://dpp.cz">DPP Praha</a>'
loadData = (src, cb) ->
    (stationCoordinates) <~ $.getJSON src
    cb null, stationCoordinates
(err,[stationCoordinates, stopDifferences, stationNames]) <~ async.map do
    *   './data/stationCoordinates.json'
        './data/stopDifferences.json'
        './data/stationNames.json'
    *   loadData

color = d3.scale.linear!
    .domain [-2000, 0,2000]
    .range  ['#D7191C' '#FFFFBF' '#1A9641']
window.stationCoordinates = stationCoordinates

stationCoordinates.forEach (coord, id) ->
    if coord
        diff = stopDifferences[id]
        # return if -50 < diff < 50
        markerColor = color diff
        dir = if diff > 0 then "více" else "méně"
        icon = L.divIcon do
            *   html: "<span style='background: #markerColor' title='#{stationNames[id]}: o #{Math.abs diff} #dir spojení'></span>"
                iconSize: [15 15]
                className: "station-marker"
        new L.marker coord, {icon}
            ..addTo map
