var currentPage = '#page1'
var deck

var player = {
    cards:[],
    total:0
}

var dealer = {
    cards: [],
    total:0
}

// Gør det muligt at bette noget til at starte med.
var balance = 1000 
var currentBet = 0
var state = "begin"

function setup(){ //P5 setup() bliver kaldt EN gang før siden vises 
    console.log('P5 setup kaldt inshallah')
    
    //skift til current page 
    shiftPage(currentPage)
    
    getDeck()

    select('#playerDrawBtn').mousePressed(() => drawCard("player") )
    select('#playerStandBtn').mousePressed(() => drawCard("dealer") )
    select('#restartBtn').mousePressed(restart)
    
    jetoner()

    // Gør så player ikke kan spille før de har lavet bet
    select('#playerDrawBtn').attribute('disabled', '')
    select('#playerStandBtn').attribute('disabled', '')

    // Logik for at placere bet
    select('#placeBetBtn').mousePressed(() => {
        if (currentBet <= 0 || currentBet > balance) {
            select('#current-bet').html(`Current Bet: ${currentBet} - You are too broke! 😖`)
            return
        }
        balance -= currentBet
        select('#balance-display').html(`Balance: ${balance}`)
        select('#placeBetBtn').hide() // Skjul knappen når spillet starter
        
        // Gør det muligt for player at spille når de har lavet deres bet
        select('#playerDrawBtn').removeAttribute('disabled')
        select('#playerStandBtn').removeAttribute('disabled')
        state = "player" 
    })

    //Sæt menu op
    //Hent alle sider som et array
    var allPages = selectAll('.page')
    //Løb listen igennem en for en 
    allPages.map(page => {
        //Lav et nyt <a> element 
        var menuItem = createElement('a')
        //Sæt a taggets html til sidens titel
        menuItem.html(page.attribute('title'))
        //sæt eventlistener på a tagget
        menuItem.mousePressed(
            () => shiftPage('#' + page.attribute('id')))
        //sæt a tagget ind i sidebaren
        select('.sidebar').child(menuItem)
    })
}

//Async står for asyncronous - vi ved ikke præcis hvor længe det tager at køre funktionen  
async function getDeck(){
    try {
        //fetch kan hente data fra en server ude i byen 
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        //Repsonse objektet kommer tilbage fr serveren - og HVIS response.ok er true, kan vi hente data
        if(response.ok){
            deck = await response.json()
            drawCard("begin") // Gør så player kan sin hånd med det samme (alså lige når vi har hendte det online)
        }
    } catch (error){ console.log(error) }
}

async function drawCard(newState) {
    if (newState) state = newState;

    // Start - giv kort til spiller og dealer
    if (state == "begin") {
        player.cards = [];
        dealer.cards = [];

        // Hent 2 kort til hver
        player.cards.push(await getOneCard(), await getOneCard());
        dealer.cards.push(await getOneCard(), await getOneCard());

        // Skjul dealerens første kort
        dealer.cards[0].hidden = true;

        showCards();
    }

    // Spiller trækker et kort
    if (state == "player") {
        player.cards.push(await getOneCard());
        showCards();

        // Tjek om spiller er gået over 21
        if (calculateTotal(player.cards) > 21) showResult("Du tabte! 👎");
    }

    // Dealer spiller - trækker til de har 17+
    if (state == "dealer") {
        dealer.cards[0].hidden = false; // Afslør det skjulte kort
        showCards();

        while (calculateTotal(dealer.cards) < 17) {
            dealer.cards.push(await getOneCard());
            showCards();
            await new Promise(res => setTimeout(res, 1000)); // Vent 1 sek mellem kort
        }

        determineWinner(); // Find ud af hvem der vandt
    }
}

// Finder ud af hvem der vandt og udbetaler penge
function determineWinner() {
    var pSum = calculateTotal(player.cards)
    var dSum = calculateTotal(dealer.cards)
    var msg = ""

    if (dSum > 21) {
        msg = "Dealer gik over, du vinder!😝"
        balance += currentBet * 2
    } else if (pSum > dSum) {
        msg = "Du vandt! 😝"
        balance += currentBet * 2
    } else if (dSum > pSum) {
        msg = "Dealer vandt.👎"
    } else {
        msg = "Uafgjort!🤨"
        balance += currentBet
    }

    select('#balance-display').html(`Balance: ${balance}`)
    showResult(msg)
}

// Finder værdien af et enkelt kort
function returnCardValue(card) {
    if (isNaN(card.value)) {
        if (card.value == "ACE") {
            return 11  // Es er 11 til at starte med
        } else {
            return 10  // Billedkort er 10
        }
    } else {
        return Number(card.value)  // Tal-kort er deres værdi
    }
}

// Beregner den samlede hånd-værdi
function calculateTotal(hand) {
    let total = 0
    let aces = 0

    hand.forEach(card => {
        if (card.hidden) return  // Skjulte kort tæller ikke med
        if (card.value == "ACE") aces++  // Hold styr på esser
        total += returnCardValue(card)   // Læg kortets værdi til
    })

    // Hvis over 21, tæl Es som 1 i stedet for 11
    while (total > 21 && aces > 0) { total -= 10; aces-- }

    return total
}

// Gør klar til en ny runde
function restart(){
    shiftPage('#page1')
    player.cards = []; dealer.cards = [];
    currentBet = 0
    state = "begin"
    
    showCards()
    select('#result').html('')
    select('#current-bet').html('Current Bet: 0')
    select('#placeBetBtn').show()
    select('#playerDrawBtn').attribute('disabled', '')
    select('#playerStandBtn').attribute('disabled', '')
    
    drawCard("begin")
}

function showCards(){

    // Playerens kort
    select('#player .cards').html('')
    player.cards.map((c, i) => {
        var img = createImg(c.image)
        img.style('transform', `translate(${i*30}px, 0px)`)
        select('#player .cards').child(img)
    })
    // Dealerens kort
    select('#dealer .cards').html('')
    dealer.cards.map((c, i) => {
        // Vis bagside hvis kortet er markeret 'hidden'
        var img = c.hidden ? createImg('https://deckofcardsapi.com/static/img/back.png') : createImg(c.image)
        img.style('transform', `translate(${i*30}px, 0px)`)
        select('#dealer .cards').child(img)
    })
    select('#player-total').html(`Total: ${calculateTotal(player.cards)}`)
}

// Henter ét kort fra det nuværende deck via API
async function getOneCard(){
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`)
    const data = await response.json()
    return data.cards[0]
}

// Skifter mellem de forskellige sider i HTML
function shiftPage(newPage){
    select(currentPage).removeClass('show')
    select(newPage).addClass('show')
    currentPage = newPage
}

// Gør det muligt at klikke på mønter for at bette
function jetoner() {
    selectAll('.jeton').map(j => {
        j.mousePressed(() => {
            var v = Number(j.attribute('data-værdi'))
            if (currentBet + v <= balance) {
                currentBet += v
                select('#current-bet').html(`Current Bet: ${currentBet}`)
            } else {
                select('#current-bet').html(`Current Bet: ${currentBet} - you cant bet more! 😖`)
            }
        })
    })
}

// Viser resultatet på side 2
function showResult(tekst) {
    select('#result').html(tekst)
    shiftPage('#page2')
}