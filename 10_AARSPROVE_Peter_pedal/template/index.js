// ============================================
// STATE
// ============================================
var currentPage = '#start'
var gameState = 0
var timerInterval = null
var seconds = 0

// Rum 1: antal fundne symboler
var symbolsFound = 0

// Rum 2: rigtig rækkefølge og tæller
var cloudAnswer = ['cloud1', 'cloud3', 'cloud2']
var cloudStep = 0

// Firestore reference
var scoresRef = db.collection('highscores')

// ============================================
// SETUP — kaldes én gang af p5.js
// ============================================
function setup() {
    noCanvas()
    shiftPage('#start')
    loadHighScores()

    // ---- STARTSIDE ----
    select('#btn-start').mousePressed(() => {
        startGame()
    })

    // ---- RUM 1: Hotspots ----
    select('#room1 #symbol1').mousePressed(() => findSymbol('#room1 #symbol1'))
    select('#room1 #symbol2').mousePressed(() => findSymbol('#room1 #symbol2'))
    select('#room1 #symbol3').mousePressed(() => findSymbol('#room1 #symbol3'))

    // ---- RUM 2: Skyer ----
    select('#room2 #cloud1').mousePressed(() => clickCloud('cloud1'))
    select('#room2 #cloud2').mousePressed(() => clickCloud('cloud2'))
    select('#room2 #cloud3').mousePressed(() => clickCloud('cloud3'))

    select('#room2 #room2-submit').mousePressed(() => {
        checkRoom2Answer()
    })

    // ---- SLUTSIDE ----
    select('#btn-save').mousePressed(() => {
        saveHighScore()
    })

    select('#btn-restart').mousePressed(() => {
        resetGame()
    })
}

// ============================================
// SHIFTPAGE — skifter mellem rum/sider
// ============================================
function shiftPage(newPage) {
    select(currentPage).removeClass('show')
    select(newPage).addClass('show')
    currentPage = newPage
}

// ============================================
// TIMER — tæller 1 op hvert sekund
// ============================================
function startTimer() {
    seconds = 0
    timerInterval = setInterval(() => {
        seconds++
        select('#timer').html(seconds + ' sek')
    }, 1000)
}

function stopTimer() {
    clearInterval(timerInterval)
}

// ============================================
// START SPIL
// ============================================
function startGame() {
    gameState = 0
    symbolsFound = 0
    cloudStep = 0
    startTimer()
    shiftPage('#room1')
}

// ============================================
// RUM 1: FIND SYMBOLER I JUNGLEN
// ============================================
function findSymbol(id) {
    select(id).hide()
    symbolsFound++
    select('#room1-found').html('Fundet: ' + symbolsFound + ' / 3')

    if (symbolsFound === 3) {
        gameState = 1
        shiftPage('#room2')
    }
}

// ============================================
// RUM 2: KLIK SKYER I RÆKKEFØLGE
// ============================================
function clickCloud(id) {
    if (id === cloudAnswer[cloudStep]) {
        cloudStep++
    } else {
        cloudStep = 0
    }

    if (cloudStep === cloudAnswer.length) {
        select('#room2 #room2-code').addClass('show')
    }
}

function checkRoom2Answer() {
    var answer = select('#room2 #room2-answer').value().toLowerCase()
    if (answer.includes('kort')) {
        gameState = 2
        stopTimer()
        select('#final-time').html('Din tid: ' + seconds + ' sekunder')
        shiftPage('#complete')
    } else {
        select('#room2 #room2-error').html('Ikke helt - prøv igen!')
    }
}

// ============================================
// HIGH SCORE (Firestore)
// ============================================
function loadHighScores() {
    scoresRef.orderBy('seconds', 'asc').limit(10).onSnapshot(snap => {
        select('#score-list').html('')
        snap.forEach(doc => {
            var d = doc.data()
            var li = createElement('li')
            li.child(createElement('span', d.name))
            li.child(createElement('span', d.seconds + ' sek'))
            select('#score-list').child(li)
        })
    })
}

function saveHighScore() {
    var name = select('#player-name').value().trim()
    if (name === '') {
        select('#player-name').attribute('placeholder', 'Skriv dit navn først!')
        return
    }
    console.log('Du trykkede Gem! Navn:', name, '— Tid:', seconds, 'sek')
    console.log('TODO: Åbn firebase.js og indsæt jeres Firebase-config. Derefter virker scoresRef.add() og gemmer data i Firestore.')

    // Udkommenter linjen herunder når firebase.js er sat op:
    // scoresRef.add({ name: name, seconds: seconds }).then(() => {
    //     select('#btn-save').attribute('disabled', true)
    //     select('#btn-save').html('Gemt!')
    // })
}

// ============================================
// RESET
// ============================================
function resetGame() {
    select('#timer').html('0 sek')

    // Nulstil rum 1
    select('#room1-found').html('Fundet: 0 / 3')
    select('#room1-hint').html('Find de 3 skjulte symboler i junglen...')
    select('#room1 #symbol1').show()
    select('#room1 #symbol2').show()
    select('#room1 #symbol3').show()

    // Nulstil rum 2
    select('#room2 #room2-code').removeClass('show')
    select('#room2 #room2-answer').value('')
    select('#room2 #room2-error').html('')

    // Nulstil slutside
    select('#btn-save').removeAttribute('disabled')
    select('#btn-save').html('Gem high score')
    select('#player-name').value('')

    shiftPage('#start')
}
