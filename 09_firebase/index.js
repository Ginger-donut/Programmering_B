//lav en ref til din collection
var quotesRef = db.collection('quotes_data')
console.log('oprettet reference til test')

//P5 setup() bliver kaldt EN gang før siden vises 
function setup(){
    //NU KOMMER DET GENIALE: ONSNAPSHOT 
    quotesRef.onSnapshot( snap => {
        select('#quotes').html('')
        console.log('Modtog snap', snap.size)
        //ryd quotes div og sæt de nye quotes ind
        snap.forEach( doc => {
            var d = doc.data()
            console.log(d)
            // Opret quote kort med knapper
            select('#quotes').child(
                createDiv().addClass('card').child(
                    createDiv(d.text)
                ).child(
                    createDiv('- ' + d.yapper).addClass('yapper')
                ).child(
                    createDiv(d.modtager ? '(sagt til ' + d.modtager + ')' : '(sagt ud i rummet)').addClass('modtager')
                ).child(
                    createDiv(d.timestamp.toDate().toLocaleDateString("da-dk",{
                        day: "numeric",
                        month: "short",
                        year: "2-digit"
                    })).addClass('date')
                ).child(
                    createImg('./assets/delete.png')
                    .addClass('delete')
                    .mousePressed( ()=>{
                        if(confirm("ER du nu sikker på at du vil slette - permanent og uopretteligt - dit quote: " + d.text)){
                            quotesRef.doc(doc.id).delete()
                        }
                    } )
                )
            )
        })
    })
}

//key pressed er en indbygget p5.js funktion 
function keyPressed(){
    if(key == "Enter"){
        var q = select('#newQuote').value()
        var y = select('#newYapper').value()
        var m = select('#newModtager').value()

        if(q == "") {
            alert('skriv venligst noget FØR DU TRYKKER ENTER')
            return
        }
        if(y == "") {
            alert('skriv venligst hvem der har sagt det FØR DU TRYKKER ENTER')
            return
        }

        //nu skal vi gemme det nye quote i firestore
        //funktionen add() på en collectionref 
        //OPRETTER en ny collection hvis den IKKE findes 
        quotesRef.add({
            text: q,
            yapper: y,
            modtager: m,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
            //.then kaldes asynkront NÅR add er færdig
        }).then(
            console.log('Quote gemt i databasen', q)
        )
        select('#newQuote').value('')
        select('#newYapper').value('')
        select('#newModtager').value('')
    }
}