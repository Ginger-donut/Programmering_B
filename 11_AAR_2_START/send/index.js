var client
var topic = 'ass/regnestykke'

function setup(){
    noCanvas()
    client = mqtt.connect('wss://mqtt.nextservices.dk')

    client.on('connect', () => {
        visToast('Forbundet til NEXT MQTT server')
    })

    select('#sendBtn').mousePressed(()=>{
        var udtryk = select('#exprInput').value()
        if(udtryk){
            client.publish(topic, udtryk, { retain: true })
            visToast('Sendte: ' + udtryk)
            select('#exprInput').value('')

            setTimeout(()=>{
                window.location.href = '../modtag/index.html'
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