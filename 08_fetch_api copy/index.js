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

    // Gør så player ikke kan spille før de har lavet bet (valgte attribute så jeg ikke skal lave noget i css☝️🤓)
    select('#playerDrawBtn').attribute('disabled', '')
    select('#playerStandBtn').attribute('disabled', '')

    //GAMBLING HEHEHE😝
    //For at placere bet
    // mousePressed er en P5.js funktion der kører koden når knappen klikkes
    select('#placeBetBtn').mousePressed(() => {
        //currentBet <= 0 betyder at spilleren ikke har valgt nogen jetons endnu og currentBet > balance holder øje med om spilleren prøver at bette mere end de har
        if (currentBet <= 0 || currentBet > balance) {  
            select('#current-bet').html(`Current Bet: ${currentBet} - You are too broke! 😖`)
            return // Hvis EN AF DE TO er sande stopper resten funktionen ved hjælp af "return"
        }
        balance -= currentBet // Træk det bettede beløb fra balancen 
        select('#balance-display').html(`Balance: ${balance}`) //Opdater hvad der står på skærmen så den nye balance vises
        select('#placeBetBtn').hide() // Skjul knappen når spillet starter, der ikke kan laves nye bets midt i en runde
        
        // Gør det muligt for player at spille når de har lavet deres bet, ved at fjerne "disabled" attribute
        select('#playerDrawBtn').removeAttribute('disabled')
        select('#playerStandBtn').removeAttribute('disabled')
        state = "player" // Sige til drawCard funktionen at dette er spillerens tur, så den ved hvad den skal gøre hvis det er spillerens tur
        drawCard("begin") // Deler bare kort ud😝
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
        }
    } catch (error){ console.log(error) }
}

// async funktionen gør så der kan bruges await senere i funktionen
async function drawCard(newState) {
    if (newState) state = newState;

    // Start - giv kort til spiller og dealer, køres kun når state er "begin"
    if (state == "begin") {
        player.cards = [];
        dealer.cards = [];

        // await betyder vi VENTER på at kortet kommer tilbage før vi fortsætter
        // push() tilføjer kortene til hænderne
        player.cards.push(await getOneCard(), await getOneCard());
        dealer.cards.push(await getOneCard(), await getOneCard());

        //showCards() tjekker hidden og viser bagsiden af kortet i stedet
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
            await new Promise(res => setTimeout(res, 500)); // Vent 0.5 sek mellem kort
        }

        determineWinner(); // Find ud af hvem der vandt
    }
}

// Finder ud af hvem der vandt og udbetaler penge
function determineWinner() {
    // Gem begges totaler i variabler så vi nemt kan sammenligne dem
    // calculateTotal() tæller kortenes værdi sammen
    var pSum = calculateTotal(player.cards)// spillerens total
    var dSum = calculateTotal(dealer.cards) // dealerens total

    //msg er den teskt er vist til spilleren på resultatsiden, den ændres alt efter hvem der vandt
    var msg = ""

    //Hvis dealer gik over 21, og spilleren vinder 
    if (dSum > 21) {
        msg = "Dealer gik over, du vinder!😝" // viser til på side 2 at dealer gik over og at de vandt
        balance += currentBet * 2 // For deres bet tilbage 2 gange, fordi de får det de bettede og det de vandt
    
    //Hvis spilleren har en højre sum end dealeren unden at selvfølgelig gå over 21, aka spilleren vinder
    } else if (pSum > dSum) { 
        msg = "Du vandt! 😝"
        balance += currentBet * 2 // samme som ovenover 

    //Hvis dealeren har en højre sum end spilleren unden at selvfølgelig gå over 21, aka dealeren vinder
    // Derfor spilleren ingen penge tilbage
    } else if (dSum > pSum) {
        msg = "Dealer vandt.👎"
    
    //hvis ingen af de ovenstående er sande, må det betyde at de har samme sum og det er uafgjort, så spilleren får deres bet tilbage
    } else {
        msg = "Uafgjort!🤨"
        balance += currentBet // Giver spilleren deres bet tilbage
    }

    // Opdater balancen på skærmen så spilleren kan se deres nye balance
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
    let aces = 0 // holder øje med hvor mange esser der i i hånden

    // forEach går igennem hvert kort i hånden 
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
    player.cards = []; 
    dealer.cards = [];  
    currentBet = 0 
    state = "begin"
    
    showCards()
    select('#result').html('') // ryd resultatteksten
    select('#current-bet').html('Current Bet: 0') // nulstiller bet-display
    select('#placeBetBtn').show() // viser place bet knappen igen
    select('#playerDrawBtn').attribute('disabled', '') // låser knapperne igen indtil nyt bet
    select('#playerStandBtn').attribute('disabled', '')
    
}

function showCards(){

    // Playerens kort
    select('#player .cards').html('')

    // c = det nuværende kort
    // i = index - altså kortets nummer i arrayet (0, 1, 2...)
    player.cards.map((c, i) => {

        var img = createImg(c.image) // viser et billede at kortet
        img.style('transform', `translate(${i*30}px, 0px)`) // gøre så de ligger smukt ovenpå hinanden ved at forskyde hvert kort 30px til højre forrige kort
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
    select('#player-total').html(`Total: ${calculateTotal(player.cards)}`)// Opdater spillerens total under kortene på side 1, så de kan se det mens de spiller
}

// Henter ét kort fra det nuværende deck
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
    // finder alle elementer med klassen "jeton" og laver en klik-funktion for hver af dem
    selectAll('.jeton').map(j => {
        j.mousePressed(() => {
            // henter værdien af jetonen fra data-værdi arttributen og gør det til et nummer
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
    // Tømmer kort-div'en på side 2 så der ikke er gamle kort fra forrige runde
    select('#final-player .cards').html('')

    // Vis spillerens kort på side 2
    // map() kører koden for hvert kort i arrayet
    player.cards.map((c, i) => {
        var img = createImg(c.image) // lav et billede med kortets URL fra API'en
        img.style('transform', `translate(${i*30}px, 0px)`) // forskyd hvert kort 30px til højre så de overlapper pænt
        select('#final-player .cards').child(img) // tilføj billedet til kort-div'en
        
        select('#final-dealer-total').html(`Total: ${calculateTotal(dealer.cards)}`) // Opdater dealerens total på side 2 (den skal opdateres her fordi det først er når vi kommer til side 2 at alle dealerens kort er afsløret)   
        select('#final-player-total').html(`Total: ${calculateTotal(player.cards)}`) // gør det samme for spillerens 
    })

    // Samme som ovenfor men for dealeren
    select('#final-dealer .cards').html('')
    dealer.cards.map((c, i) => {
        var img = createImg(c.image) // ingen hidden tjek her - alle kort skal være synlige på side 2
        img.style('transform', `translate(${i*30}px, 0px)`)
        select('#final-dealer .cards').child(img)
    })

    // Vis resultatteksten
    select('#result').html(tekst)

    // Skift til side 2 så spilleren kan se resultatet
    shiftPage('#page2')
}
