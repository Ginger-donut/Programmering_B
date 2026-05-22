// ============================================
// Start
// ============================================
var currentPage = '#start'
var timerInterval = null // Reference til intervallet der opdaterer timeren, så den kan stoppe det senere
var seconds = 0 // Antal sekunder siden spillet startede, opdateres hvert sekund af timerInterval

// Room 1 (Bedroom)
const ROOM1_CODE = '2' // const gør at denne værdi ikke kan ændres senere i koden, da det er en fast del af spillets gåde

// Room 2 (Kitchen)
var fruitsFound = 0 //  var gør i modsætning til const at denne værdi kan ændres, da spilleren finder frugter og klikker på dem, og spillet skal holde styr på hvor mange der er fundet indtil videre

// Room 3 (Living room)
const xylophone_answer = ['rød', 'grøn', 'gul', 'orange', 'grøn'] // array, (rækkefølgen af farver der skal trykkes i xylofon-gåden)
var xylophone_step = 0 // ændre sig hver gang spilleren trykker på en tone i xylofonen, for at holde styr på hvor langt i rækkefølgen de er kommet

// Room 4 (Office)
const ROOM4_CODE = '255'
const BLUR_ANSWERS = ['udenfor', 'haven', 'have', 'huset', 'gård'] // array, med de forskellige svarmuligheder

// Firestore reference
var scoresRef = db.collection('highscores') // en variabel, så jeg ikke skal skrive hele db.collection('highscores') hver gang jeg vil tilgå high scores i Firestore, og kan bare skrive scoresRef i stedet. 
// db er den globale variabel der er tilgængelig fordi jeg har inkluderet Firebase SDK i HTML-filen, og collection('highscores') fortæller at jeg vil arbejde med 'highscores' samlingen i Firestore databasen. scoresRef kan så bruges til at læse og skrive high scores i databasen.

// ============================================
// Preload
// ============================================
var soundRed, soundYellow, soundGreen, soundOrange

function preload() { // preload() er en speciel funktion i p5.js der kører før setup(), og venter på at alle loadSound() er færdige før den starter spillet, så lydene er klar til at blive spillet når spilleren trykker på xylofonen, hvis de ikke var i preload ville jeg ikke kunne brige dem i resten af filen
    soundRed    = loadSound('./assets/c.mp3')
    soundYellow = loadSound('./assets/a.mp3')
    soundGreen  = loadSound('./assets/e.mp3')
    soundOrange = loadSound('./assets/g.mp3')
}

// ============================================
// Setup
// ============================================
function setup() { //p5.js funktion, kører en gang når spillet starter
    loadHighScores() // Henter high scores fra firebase, og viser dem på start siden.

    // ---- START PAGE ----
    select('#btn-start').mousePressed(() => startGame()) //select('#btn-start') finder knappen med id 'btn-start' i HTML-filen, og mousePressed() er en p5.js funktion der tilføjer en event listener for klik på knappen, og når knappen klikkes kører den den funktion jeg har defineret inde i parenteserne, som i dette tilfælde er startGame() funktionen der starter spillet. ()=> er en arrow function, som er en kortere måde at skrive function() 

    // ---- ROOM 1: Bedroom ----
    select('#note-hotspot').mousePressed(() => select('#note-popup').addClass('show'))  // addClass('show') og removeClass('show') bruges til at vise og skjule elementer.
    select('#note-close').mousePressed(() => select('#note-popup').removeClass('show'))
    select('#btn-room1-check').mousePressed(() => checkRoom1Code())
    select('#btn-room1-next').mousePressed(() => shiftPage('#room2'))

    // ---- ROOM 2: Kitchen ----
    select('#banan').mousePressed(()      => findFruit('#banan')) //har lavet en funktion findFruit() der tager id'et på den frugt der er klikket argument så funktionen ved hvilken frugt den skal skjule.
    select('#watermelon').mousePressed(() => findFruit('#watermelon'))
    select('#lemon').mousePressed(()      => findFruit('#lemon'))
    select('#orange').mousePressed(()     => findFruit('#orange'))
    select('#lime').mousePressed(()       => findFruit('#lime'))
    select('#btn-room2-next').mousePressed(() => shiftPage('#room3'))

    // ---- ROOM 3: Living room ----
    select('#key-rød').mousePressed(()    => pressKey('rød')) // Samme princip som frugterne
    select('#key-grøn').mousePressed(()   => pressKey('grøn'))
    select('#key-gul').mousePressed(()    => pressKey('gul'))
    select('#key-orange').mousePressed(() => pressKey('orange'))
    select('#btn-room3-next').mousePressed(() => shiftPage('#room4'))

    // ---- ROOM 4: Office ----
    select('#computer-hotspot').mousePressed(() => {
        select('#room4-codeinput').addClass('show')
    })
    select('#btn-room4-check').mousePressed(() => checkRoom4Code())
    select('#btn-blur-guess').mousePressed(() => checkBlurGuess())
    select('#btn-room4-next').mousePressed(() => {
        shiftPage('#complete')
        stopTimer() // stopper tiden inde spillerne går videre til end-siden
        select('#final-time').html('Din tid: ' + seconds + ' sekunder') // gør så der står "Din tid: X sekunder" på end-siden 
    })

    // ---- END PAGE ----
    select('#btn-save').mousePressed(() => saveHighScore())
    select('#btn-restart').mousePressed(() => resetGame())
}

// ============================================
// Shift page
// ============================================
function shiftPage(newPage) {
    // I stedet for at vise/skjule sider direkte alle steder i koden, samles det i én funktion. Det betyder at hvis vi vil ændre hvordan sideskift virker, skal vi kun ændre ét sted.
    select(currentPage).removeClass('show')  // Skjul siden der vises nu
    select(newPage).addClass('show')         // Vis den nye side
    currentPage = newPage                 
}

// ============================================
// Timer
// ============================================
function startTimer() {
    seconds = 0
    timerInterval = setInterval(() => {
        seconds++ // tæller sekunderne op, det er en genvej for seconds = seconds + 1
        select('#timer').html(seconds + ' sek') // opdater timeren i html
    }, 1000) // 1000 millisekunder = 1 sekund
}

function stopTimer() {
    clearInterval(timerInterval) //stopper det interval der blev startet i startTimer, så timeren holder op med at tælle op når spillet er færdigt
}

// ============================================
// Start spillet
// ============================================
function startGame() { // nulstiller alle variabler og elementer til startværdier, og starter timeren
    fruitsFound = 0
    xylophone_step = 0
    blurLevel = 20
    startTimer()
    shiftPage('#room1')
}

// ============================================
// ROOM 1: Gåde
// ============================================
function checkRoom1Code() {
    var input = select('#room1-code').value().trim() // .value() henter det der står i input-feltet, og .trim() fjerner eventuelle ekstra mellemrum før eller efter teksten, så det ikke forstyrrer hvis spilleren kommer til at skrive " 2 " i stedet for "2"
    if (input === ROOM1_CODE) { // Her har jeg valgt at bruge === i stedet for ==, fordi === både tjekker om værdierne er ens og om datatyperne er ens, så det sikrer at spilleren skal skrive præcis det rigtige (en string '2' i dette tilfælde) for at det virker, js vil tage input fra tekstfeltet som en string, og forstå det som '2' da det kommer fra et tesktfelt
        select('#room1-success').addClass('show') // skjul popup'en
        select('#room1-success').addClass('show')  // vis success-boksen
    } else {
        select('#room1-error').style('display', 'block') // vis fejlbeskeden ved at sætte display til block
    }
}

// ============================================
// ROOM 2: Find frugterne
// ============================================
function findFruit(id) { // tager i mod et id som argument, så den kan bruges til alle frugterne i stedet for at lave en funktion for hver frugt
    select(id).hide() // skjul den frugt der er klikket på ved at sætte display til none
    fruitsFound++ // tæller antallet af fundne frugter op
    select('#room2-found').html('Frugter fundet: ' + fruitsFound + ' / 5') // opdaterer teksten der viser hvor mange frugter der er fundet, ved at sætte html'en til "Frugter fundet: X / 5" hvor X er det aktuelle antal fundne frugter
    if (fruitsFound === 5) { // tjekker om alle 5 frugter er fundet, det sker efter fruitsFound++, så det er altod den opdaterede værdi der tjekkes. 
        select('#room2-success').addClass('show')
    }
}

// ============================================
// ROOM 3: xylofon
// ============================================
function playSound(color) {
    if (color === 'rød')         soundRed.play()
    else if (color === 'grøn')   soundGreen.play()
    else if (color === 'gul')    soundYellow.play()
    else if (color === 'orange') soundOrange.play()
}

function pressKey(color) {
    playSound(color) // gør så uanset om tangenten er rgtig eller forkert spiller den.
    if (color === xylophone_answer[xylophone_step]) {
        xylophone_step++    // xylophone_answer[xylophone_step] er det næste forventede trin i melodien. Hvis den trykkede tangent matcher, går vi et trin frem.
        select('#room3-progress').html('Trin: ' + xylophone_step + ' / 5')
        if (xylophone_step === xylophone_answer.length) { //.lenght er antallet af elementer i arrayet, så når xylophone_step når det antal trin der er i svaret, betyder det at hele melodien er spillet korrekt.
            select('#room3-success').addClass('show')
        }
    } else { // Hvis den trykkede tangent ikke matcher det forventede trin i melodien, nulstilles spillet for dette rum, så spilleren skal starte forfra.
        xylophone_step = 0
        select('#room3-progress').html('Trin: 0 / 5')
        select('#room3-error').addClass('show')
        setTimeout(() => select('#room3-error').removeClass('show'), 1500) // vis en fejlbesked i 1.5 sekund ved at tilføje klassen 'show' til #room3-error, og så fjerne den igen efter 1.5 sekund, så beskeden forsvinder igen
    }
}

// ============================================
// ROOM 4: kontor (kode til computeren)
// ============================================
function checkRoom4Code() {
    var input = select('#room4-code').value().trim()
    if (input === ROOM4_CODE) {
        select('#room4-codeinput').removeClass('show')
        select('#room4-blur').addClass('show') // viser det slørede billede og gættekassen når koden er korrekt
    } else {
        select('#room4-error').style('display', 'block')
    }
}

// ============================================
// ROOM 4: kontor (gæt det uklare billede)
// ============================================
function checkBlurGuess() {
    var input = select('#blur-guess').value().trim().toLowerCase()  // .toLowerCase() konverterer til små bogstaver så "Haven" og "HAVEN" matcher på samme måde som "haven" i BLUR_ANSWERS arrayet.
    var correct = false

    for (var i = 0; i < BLUR_ANSWERS.length; i++) {
        if (input === BLUR_ANSWERS[i]) { // tjekker om det indtastede gæt matcher nogen af de korrekte svar i BLUR_ANSWERS arrayet.
            correct = true
            break // hvis vi har fundet et match, behøver vi ikke tjekke resten af svarene i arrayet, så vi kan stoppe løkken med break
        }
    }

    if (correct) {
        select('#blur-guess-error').style('display', 'none') // vises ikke
        select('#blur-guess-correct').style('display', 'block') // vises
        select('#blur-img').style('filter', 'blur(0px)') // gør billedet klart ved at sætte blur til 0. 
        setTimeout(() => {
            select('#room4-blur').removeClass('show')
            select('#room4-success').addClass('show')
        }, 1000)
    } else {
        select('#blur-guess-correct').style('display', 'none') // vises ikke
        select('#blur-guess-error').style('display', 'block') // vises
        select('#blur-guess').value('') // rydder gæt-inputfeltet så spilleren kan prøve at skrive et nyt gæt uden at skulle slette det forrige
    }
}

// ============================================
// HIGH SCORE (Firestore)
// ============================================
function loadHighScores() {
    scoresRef.orderBy('seconds', 'asc').limit(10).onSnapshot(snap => {
        // .orderBy('seconds', 'asc') sorterer fra lavest til højest tid
        // .limit(10) henter kun top 10 så listen ikke vokser i det uendelige
        // .onSnapshot() hvis nogen gemmer en ny score, opdateres listen automatisk uden at siden skal genindlæses


        select('#score-list').html('') // html('') rydder listen inden den genopbygges, uden den ville onSnapshot() tilføje nye rækker oven på de gamle hver gang databasen ændrer sig, så de samme scores ville vises flere gange.
        snap.forEach(doc => {
            var d = doc.data() // .data() henter selve indholdet ud af dokumentet. d.name er spillerens navn, d.seconds er deres tid.
            var li = createElement('li') // createElement('li') laver et nyt <li> element, som vi kan tilføje til listen i HTML-filen.
            li.child(createElement('p', d.name))// tilføjer et <p> element inde i <li> elementet, med spillerens navn som tekst
            li.child(createElement('p', d.seconds + ' sek')) // tilføjer et <p> element inde i <li> elementet, med spillerens tid som tekst
            select('#score-list').child(li) // tilføjer det færdige <li> element til #score-list i HTML-filen, så det bliver vist på siden
        })
    })


function saveHighScore() {
    var name = select('#player-name').value().trim()
    scoresRef.add({ name: name, seconds: seconds }).then(() => { //add() gemmer et nyt dokument i Firebase. .then() kører først når Firebase bekræfter at det er gemt, så knappen ikke deaktiveres før vi er sikre på det lykkedes
        select('#btn-save').attribute('disabled', true) // deaktiverer gem-knappen så spilleren ikke kan klikke på den flere gange og gemme flere scores, eller forsøge at klikke før deres score er gemt
        select('#btn-save').html('Gemt!')
    })
}

// ============================================
// Reset spillet
// ============================================
function resetGame() { //Nulstiller absolut alt tilbage til udgangspunktet.
    stopTimer()
    select('#timer').html('0 sek')

    // Room 1
    select('#room1-success').removeClass('show')
    select('#note-popup').removeClass('show')
    select('#room1-code').value('')
    select('#room1-error').style('display', 'none')

    // Room 2
    fruitsFound = 0
    select('#room2-found').html('Frugter fundet: 0 / 5')
    select('#room2-success').removeClass('show')
    selectAll('.fruit').forEach(fruit => fruit.show()) // Det er det samme som at skrive show() på hver frugt manuelt

    // Room 3
    xylophone_step = 0
    select('#room3-progress').html('Trin: 0 / 5')
    select('#room3-success').removeClass('show')
    select('#room3-error').removeClass('show')

    // Room 4
    blurLevel = 20
    select('#room4-codeinput').removeClass('show')
    select('#room4-blur').removeClass('show')
    select('#room4-success').removeClass('show')
    select('#room4-code').value('')
    select('#room4-error').style('display', 'none')
    select('#blur-img').style('filter', 'blur(20px)')
    select('#blur-guess').value('')
    select('#blur-guess-error').style('display', 'none')
    select('#blur-guess-correct').style('display', 'none')

    // End page
    select('#btn-save').removeAttribute('disabled') // Aktiver gem-knappen igen så den kan bruges næste gang
    select('#btn-save').html('Gem high score')
    select('#player-name').value('')

    shiftPage('#start')

}