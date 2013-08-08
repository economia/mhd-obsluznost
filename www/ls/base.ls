binLength = 600_seconds
maxValue = 9787
midTonePositions = [0.2 0.35]
dayTexts = <[Pondělí Úterý Středa Čtvrtek Pátek Sobota Neděle]>
minuteTexts = <[10 30 50 ]>
hoursTexts = [0 til 24 by 2]

class Serviceability
    (srcAddress, parentSelector) ->
        @container = d3.select parentSelector
        <~ @loadData srcAddress
        @computeStatistics @data
        @draw!

    loadData: (srcAddress, cb) ->
        (data) <~ $.getJSON "data/#srcAddress"
        @data = data
        cb!

    computeStatistics: (data) ->
        values = []
        for day, dayIndex in data
            for dayValues in day
                values.push dayValues

        @maxValue = Math.max ...values

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
        color = d3.scale.linear!
            .domain [0, maxValue*midTonePositions.0, maxValue*midTonePositions.1, maxValue]
            .range  ['#2C7BB6', '#ABD9E9', '#FDAE61' '#D7191C']

        days.selectAll ".bin"
            .data -> it
            .enter!append "div"
                ..attr \class \bin
                ..attr \data-tooltip (value, binIndex) -> escape "<strong>#{getTime binIndex}:</strong> <strong>#value</strong> obsloužených zastávek"
                ..style \background -> color it

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
new Serviceability do
    'dailyBins_20120319.json'
    ".container.c1"

new Serviceability do
    'dailyBins_20130625.json'
    ".container.c2"

new Serviceability do
    'dailyBins_20130705.json'
    ".container.c3"
new Tooltip!watchElements!
