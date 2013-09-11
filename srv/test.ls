require! request
require! async
require! fs
addresses =
    "422, Cihlářská, 19000,Prosek,Praha"
    "627, Třebihošťská, 19012,Dolní Počernice,Praha"
    "472, Vycpálkova, 14900,Chodov,Praha"
    "816, Bořivojova, 13000,Žižkov ,Praha"
    "1852, Bellušova, 15500,Stodůlky ,Praha"
    "1805, Bellušova, 15500,Stodůlky ,Praha"
    "793, Bílovská, 15500,Řeporyje ,Praha"
    "2379, Borovanského 15500,Stodůlky ,Praha"
    "2014, Bronzová, 15500,Stodůlky ,Praha"
    "873, Klidná, 16200,Střešovice,Praha"
    "2023, Dittrichova, 12000,Nové Město ,Praha"
    "334, Trojská, 18200,Troja ,Praha"
# addresses.length = 1
(err, bodies) <~ async.map addresses, (address, cb) ->
    (err, response, body) <~ request.get "http://vbox/nominatim/search.php?polygon=1&format=json&q=#{address}"
    body = JSON.parse body
    cb null, body
console.log bodies
fs.writeFile "./test.json", JSON.stringify bodies, " ", 2
