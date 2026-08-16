var client
var topic = 'ass/regnestykke'

function setup(){
    noCanvas()
    //mqtt er et objekt vi får fra mqtt bilbioteket i html siden
    client = mqtt.connect('wss://mqtt.nextservices.dk')

    client.on('connect', () => {
        client.subscribe(topic)
        visToast('Forbundet til NEXT MQTT server')
    })

    client.on('message', (t, msg) => {
        msg = msg.toString()
        if(t == topic){
            var svar = beregn(msg)

            select('#exprMsg').elt.textContent = msg
            select('#svarMsg').elt.textContent = (svar === null) ? 'Ugyldigt regnestykke' : svar // viser resultatet af regnestykket eller en fejlmeddelelse

            visToast('Nyt regnestykke: ' + msg)
        }
    })
}

function beregn(udtryk){ 
    if(!/^[0-9+\-*/(). ]+$/.test(udtryk)) return null // stopper hvis der er andet end tal/regnetegn i beskeden
    try {
        var resultat = Function('"use strict"; return (' + udtryk + ')')() // beregner regnestykket ved hjælp af Function constructor
        if(typeof resultat !== 'number' || !isFinite(resultat)) return null // stopper hvis resultatet ikke er et tal
        return resultat
    } catch(e){
        return null // stopper hvis der er en fejl i regnestykket
    }
}

function visToast(tekst){
    var toast = select('#toast')
    toast.html(tekst)
    toast.addClass('toastShown')
    setTimeout(()=>{
        toast.removeClass('toastShown')
    }, 2000)
}