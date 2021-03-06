binLength = 600_seconds
maxValue = 9787
midTonePositions = [0.2 0.35]
dayTexts = <[Pondělí Úterý Středa Čtvrtek Pátek Sobota Neděle]>
minuteTexts = <[10 30 50 ]>
hoursTexts = [0 til 24 by 2]

GraphDrawer =
    drawn: no
    days: null
    bins: null
    draw: ->
        return @redraw! if @drawn
        hourMarks = @container.append "div" .attr "class" "hourMarks"
            ..selectAll "hourMark"
                .data hoursTexts
                .enter!append "div"
                    ..attr "class" \hourMark
                    ..text -> it
            ..append "div"
                ..attr \class "legend"
                ..text "Hodiny"
        @days = @container.selectAll ".day"
            .data @data
            .enter!append "div"
                ..attr \class \day
                ..append "div"
                    ..attr \class \dayMark
                    ..text (data, index) -> dayTexts[index]

        @days.selectAll ".bin"
            .data -> it
            .enter!append "div"
                ..attr \class \bin
                ..attr \data-tooltip @getTooltipText
                ..style \background ~> @color it

        @days.append "div" .attr "class", "minuteMarks"
            ..selectAll ".minuteMark"
                .data minuteTexts
                .enter!.append \div
                    ..attr \class \minuteMark
                    ..text ->
                        it
            ..append "div"
                ..attr \class "legend"
                ..text "minuty"
        @drawn = yes

    redraw: ->
        @days.data @data
        @days.selectAll ".bin"
            ..data -> it
            ..attr \data-tooltip @getTooltipText
            ..style \background ~> @color it

window.Serviceability = class Serviceability implements GraphDrawer
    (parentSelector, @data) ->
        @container = d3.select parentSelector
        @color = d3.scale.linear!
            .domain [0, maxValue*midTonePositions.0, maxValue*midTonePositions.1, maxValue]
            .range  ['#2C7BB6', '#ABD9E9', '#FDAE61' '#D7191C']
        @draw!

    getTooltipText: (value, binIndex) ->
        escape "<strong>#{getTime binIndex}:</strong> <strong>#value</strong> obsloužených zastávek"

window.ServiceabilityDifference = class ServiceabilityDifference implements GraphDrawer
    (parentSelector, dataA, dataB) ->
        @container = d3.select parentSelector
        @color = d3.scale.linear!
            .range  ['#D7191C', '#D7191C' '#FFFFBF' '#1A9641', '#1A9641']

    setGlobalData: ->
        @color.domain [-9999, -350, 0,350, 9999]
        @setData ...

    setIndividualData: ->
        @color.domain [-999, -18, 0,18, 999]
        @setData ...

    setData: (dataA, dataB) ->
        @data = @computeDifference dataA, dataB
        @draw!

    getTooltipText: (value, binIndex) ->
        direction = if value > 0 then "více" else "méně"
        str = "<strong>#{getTime binIndex}:</strong> "
        str += switch
            | value => "o <strong>#{Math.abs value}</strong> #direction obsloužených zastávek"
            | _     => "beze změn"

        escape str

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

window.loadData = (source, cb) ->
    (data) <~ $.getJSON "data/#source"
    cb null, data
