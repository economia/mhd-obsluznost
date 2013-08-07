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
            .domain [0, @maxValue*0.28, @maxValue]
            .range  ['#2C7BB6', '#FFFFBF', '#D7191C']

        days.selectAll ".bin"
            .data -> it
            .enter!append "div"
                ..attr \class \bin
                ..style \background -> color it



serviceability = new Serviceability do
    'dailyBins_20120319.json'
    ".container"
