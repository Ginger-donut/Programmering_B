//lav en ref til din collection
var quotesRef = db.collection('quotes_data')
console.log('oprettet reference til test')
var edit_id = '' //global variabel til at holde styr på hvilket quote vi redigerer
var edit_div = ''

//P5 setup() bliver kaldt EN gang før siden vises 
function setup(){
    //NU KOMMER DET GENIALE: ONSNAPSHOT 
    quotesRef.onSnapshot( snap => {
        select('#quotes').html('')
        console.log('Modtog snap', snap.size)
        //ryd quotes div og sæt de nye quotes ind
        snap.forEach( doc => {
            var d = doc.data()
            console.log(d) //d er dataen i dokumentet, altså det quote vi har gemt i databasen
            // vi laver ej reference til text div'en
            var qDiv = createDiv(d.text)
            qDiv.mousePressed( ()=>{
                qDiv.attribute('contenteditable', 'true')
                edit_id = doc.id
                edit_div = qDiv
            })
            var dateDiv =  createDiv(d.timestamp.toDate().toLocaleDateString("da-dk",{
                        day: "numeric",
                        month: "short",
                        year: "2-digit"
                    })).addClass('date')
            dateDiv.mousePressed( ()=>{
                dateDiv.attribute('contenteditable', 'true')
            })
            // Opret quote kort med knapper
            select('#quotes').child(
                createDiv().addClass('card').child(
                    qDiv
                ).child(
                    createDiv('- ' + d.yapper).addClass('yapper')
                ).child(
                    createDiv(d.modtager ? '(sagt til ' + d.modtager + ')' : '(sagt ud i rummet)').addClass('modtager')
                ).child(
                    dateDiv
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
        if(edit_id != '') {
            quotesRef.doc(edit_id).update({text: edit_div.html()})
            .then(()=>{console.log('Quote opdateret i databasen')})
        }else{
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
}