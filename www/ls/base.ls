binLength = 600_seconds
maxValue = 9787
midTonePositions = [0.2 0.35]
dayTexts = <[Pondělí Úterý Středa Čtvrtek Pátek Sobota Neděle]>
minuteTexts = <[10 30 50 ]>
hoursTexts = [0 til 24 by 2]

GraphDrawer =
    draw: ->
        hourMarks = @container.append "div" .attr "class" "hourMarks"
            ..selectAll "hourMark"
                .data hoursTexts
                .enter!append "div"
                    ..attr "class" \hourMark
                    ..text -> it
            ..append "div"
                ..attr \class "legend"
                ..text "Hodiny"
        days = @container.selectAll ".day"
            .data @data
            .enter!append "div"
                ..attr \class \day
                ..append "div"
                    ..attr \class \dayMark
                    ..text (data, index) -> dayTexts[index]

        days.selectAll ".bin"
            .data -> it
            .enter!append "div"
                ..attr \class \bin
                ..attr \data-tooltip @getTooltipText
                ..style \background ~> @color it

        days.append "div" .attr "class", "minuteMarks"
            ..selectAll ".minuteMark"
                .data minuteTexts
                .enter!.append \div
                    ..attr \class \minuteMark
                    ..text ->
                        it
            ..append "div"
                ..attr \class "legend"
                ..text "minuty"

class Serviceability implements GraphDrawer
    (parentSelector, @data) ->
        @container = d3.select parentSelector
        @color = d3.scale.linear!
            .domain [0, maxValue*midTonePositions.0, maxValue*midTonePositions.1, maxValue]
            .range  ['#2C7BB6', '#ABD9E9', '#FDAE61' '#D7191C']
        @draw!

    getTooltipText: (value, binIndex) ->
        escape "<strong>#{getTime binIndex}:</strong> <strong>#value</strong> obsloužených zastávek"

class ServiceabilityDifference implements GraphDrawer
    (parentSelector, dataA, dataB) ->
        @container = d3.select parentSelector
        @data = @computeDifference dataA, dataB
        @color = d3.scale.linear!
            .domain [-2200, 0,560]
            .range  ['#FC8D59' '#FFFFBF' '#91CF60']
        @draw!

    getTooltipText: (value, binIndex) ->
        direction = if value > 0 then "více" else "méně"
        escape "<strong>#{getTime binIndex}:</strong> o <strong>#{Math.abs value}</strong> #direction obsloužených zastávek"

    computeDifference: (dataA, dataB) ->
        data = []
        for day, dayId in dataA
            data[dayId] = []
            for value, hourId in day
                data[dayId][hourId] = dataB[dayId][hourId] - dataA[dayId][hourId]
        data



formatTime = (seconds) ->
    hours = "#{Math.floor seconds/3600}"
    minutes = "#{Math.floor seconds%3600/60}"
    while hours.length < 2
        hours = "0#hours"
    while minutes.length < 2
        minutes = "0#minutes"
    "#{hours}:#{minutes}"

getTime = (binIndex) ->
    seconds = binIndex * binLength
    "#{formatTime seconds} - #{formatTime seconds + binLength}"
d3.selectAll ".fallback" .remove!
loadData = (source, cb) ->
    (data) <~ $.getJSON "data/#source"
    cb null, data
sources = [
    'dailyBins_20120319.json'
    'dailyBins_20130625.json'
    'dailyBins_20130705.json'
]
(err, data) <~ async.map sources, loadData
new Serviceability do
    ".container.c1"
    data.0

new Serviceability do
    ".container.c2"
    data.1

new Serviceability do
    ".container.c3"
    data.2

new ServiceabilityDifference do
    ".container.c4"
    data.0
    data.1

new Tooltip!watchElements!
