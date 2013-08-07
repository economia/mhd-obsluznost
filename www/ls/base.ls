binLength = 600_seconds
maxValue = 16509
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
        days = @container.selectAll ".day"
            .data @data
            .enter!append "div"
                ..attr \class \day
        color = d3.scale.linear!
            .domain [0, maxValue*0.23, maxValue]
            .range  ['#2C7BB6', '#FFFFBF', '#D7191C']

        days.selectAll ".bin"
            .data -> it
            .enter!append "div"
                ..attr \class \bin
                ..attr \data-tooltip (value, binIndex) -> escape "<strong>#{getTime binIndex}:</strong> <strong>#value</strong> obsloužených zastávek"
                ..style \background -> color it

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

new Serviceability do
    'dailyBins_20120319.json'
    ".container.c1"

new Serviceability do
    'dailyBins_20130625.json'
    ".container.c2"

new Serviceability do
    'dailyBins_20130701.json'
    ".container.c3"
new Tooltip!watchElements!
