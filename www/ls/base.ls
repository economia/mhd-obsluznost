class Serviceability
    (srcAddress, @parentSelector) ->
        <~ @loadData srcAddress
        @computeStatistics @data

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


serviceability = new Serviceability do
    'dailyBins_20120319.json'
    ".container"
