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
# usableIds.length = 1
(err, differences) <~ async.mapLimit usableIds, 20, (id, cb) ->
    (err, sums) <~ async.map dirs, (dir, cb) ->
        (err, file) <~ fs.readFile "#dir/#id.json"
        data = file.toString! |> JSON.parse
        # console.log data.0
        sum = data.reduce do
            (p, c) ->
                p + c.reduce do
                    (p, c) ->
                        p + c
                    0
            0
        cb null, sum

    difference = sums.1 - sums.0
    cb null, difference
positive = differences.filter -> it > 0
negative = differences.filter -> it < 0
results = []
differences.forEach (diff, index) ->
    id = usableIds[index]
    results[id] = diff
<~ fs.writeFile "../www/data/stopDifferences.json", JSON.stringify results
console.log "+#{positive.length} / -#{negative.length} =  #{differences.length}"
