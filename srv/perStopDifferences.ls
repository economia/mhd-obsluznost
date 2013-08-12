require! <[fs async]>
date1 = 20120319
date2 = 20130625
dates = [date1, date2]
dirs = dates.map -> "../www/data/bins_#it/"
(err, files) <~ async.map dirs, (dir, cb) ->
    (err, dir) <~ fs.readdir dir
    ids = dir.map -> it.split '.' .0 |> parseInt _, 10
    cb null, ids
usableIds = files[0].filter -> it in files[1]
stationNames = require '../www/data/stationNames.json'
stations = []

usableIds.forEach (id) ->
    name = stationNames[id]
    stations.push {id, name}
stations.sort (a, b) ->
    switch
        | a.name < b.name => -1
        | a.name > b.name => 1
        | otherwise       => 0
<~ fs.writeFile "../www/data/stations.json", JSON.stringify stations
return
# usableIds.length = 1
(err, differences) <~ async.mapLimit usableIds, 20, (id, cb) ->
    (err, values) <~ async.map dirs, (dir, cb) ->
        (err, file) <~ fs.readFile "#dir/#id.json"
        data = file.toString! |> JSON.parse
        values = [].concat ...data
        cb null, values

    differences = values.0.map (value, index) ->
        values[1][index] - values[0][index]
    cb null, differences
globalDifferences = [].concat ...differences
globalDifferences.sort (a, b) -> a - b
console.log "total: #{globalDifferences.length}"
console.log "Max: #{globalDifferences[globalDifferences.length - 1]}"
console.log "Min: #{globalDifferences[0]}"

# <~ fs.writeFile "../www/data/stopDifferenceValues.json", JSON.stringify globalDifferences

