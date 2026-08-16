var client
var topic = 'ass/regnestykke' 

function setup(){
    noCanvas()
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
            select('#svarMsg').elt.textContent = (svar === null) ? 'Ugyldigt regnestykke' : svar

            visToast('Nyt regnestykke: ' + msg)
        }
    })
}

function beregn(udtryk){
    if(!/^[0-9+\-*/(). ]+$/.test(udtryk)) return null
    try {
        var resultat = Function('"use strict"; return (' + udtryk + ')')()
        if(typeof resultat !== 'number' || !isFinite(resultat)) return null
        return resultat
    } catch(e){
        return null
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