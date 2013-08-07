class Serviceability
    (srcAddress, @$parent) ->
        <~ @loadData srcAddress

    loadData: (srcAddress, cb) ->
        (data) <~ $.getJSON "data/#srcAddress"
        @data = data
        cb!



serviceability = new Serviceability do
    'dailyBins_20120319.json'
    $ ".container"
