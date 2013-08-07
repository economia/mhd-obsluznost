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
            .domain [0 @maxValue * 0.25, @maxValue * 0.5, @maxValue*0.75, @maxValue]
            .range  ['#FEF0D9' '#FDCC8A' '#FC8D59' '#E34A33' '#B30000']






        days.selectAll ".bin"
            .data -> it
            .enter!append "div"
                ..attr \class \bin
                ..style \background -> color it



serviceability = new Serviceability do
    'dailyBins_20120319.json'
    ".container"
