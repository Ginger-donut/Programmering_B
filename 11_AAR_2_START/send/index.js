var client
var topic = 'ass/regnestykke'

function setup(){
    noCanvas()
    //mqtt er et objekt vi får fra mqtt bilbioteket i html siden
    client = mqtt.connect('wss://mqtt.nextservices.dk')

    client.on('connect', () => {
        visToast('Forbundet til NEXT MQTT server')
    })

    select('#sendBtn').mousePressed(()=>{
        var udtryk = select('#exprInput').value()
        if(udtryk){
            client.publish(topic, udtryk, { retain: true }) // sender regnestykket til MQTT serveren og beholder det som den sidste besked på topicet
            visToast('Sendte: ' + udtryk)
            select('#exprInput').value('')

            setTimeout(()=>{
                window.location.href = '../modtag/index.html' // skifter til modtag/index.html efter 300ms
            }, 300)
        }
    })
}

function visToast(tekst){
    var toast = select('#toast')
    toast.html(tekst)
    toast.addClass('toastShown')
    setTimeout(()=>{
        toast.removeClass('toastShown')
    }, 2000)
}