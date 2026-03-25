// ------------------------------------------------------------------
// UNDERVISNINGS-MANUSKRIPT: ML & KNN (Chart.js Version)
// ------------------------------------------------------------------
// MÅL FOR TIMEN:
// 1. Indlæse data fra CSV
// 2. Rense data og konvertere til objekter
// 3. Visualisere data med Chart.js (Scatter plot)
// 4. Implementere KNN algoritmen (Afstand, Sortering, Afgørelse)
// ------------------------------------------------------------------

// -------------------------------------------------------------
// TRIN 1: GLOBALE VARIABLER OG INDSTILLINGER
// (Start her: Vi skal definere hvad vores program skal kunne huske)
// -------------------------------------------------------------
var table           // Her gemmer vi den rå CSV fil fra p5's loadTable
var data = []       // Her gemmer vi vores rensede data (objekter med x, y, label)
var myChart         // Her gemmer vi selve graf-objektet fra Chart.js

// INDSTILLINGER FOR DATA
var filename = 'assets/abalone_original_1000.csv'
var colX = 'Diameter'     // X-aksen: Variabel 1 (input)
var colY = 'Length'      // Y-aksen: Variabel 2 (input)
var colLabel = 'rings' // Facit: Hvilken gruppe hører man til?

// GUI Overskrifter (Gør det pænt for brugeren)
var mainTitle = "Abalone Age"
var sectionTitle1 = "1. Indtast dine tal"
var instructionText = "Angiv antal pauser og søvntimer:"
var sectionTitle2 = "2. Se Resultat i Grafen"

// Farver til vores grupper (Labels) - Chart.js bruger disse
var colorList = [
  "#F5ECFF", // very very light lavender
  "#EBD9FF", // very light lavender
  "#E0C6FF", // light lavender
  "#D6B3FF", // soft lilac
  "#CCA0FF", // light purple
  "#C28DFF", // pastel purple
  "#B87AFF", // soft violet
  "#AE67FF", // violet
  "#A454FF", // bright violet
  "#9A41FF", // strong violet
  "#902EFF", // vivid violet
  "#861BFF", // deep violet
  "#7C08FF", // intense purple
  "#6900DC", // dark purple
  "#6000C8", // deeper purple
  "#5700B4", // rich dark purple
  "#4E00A0", // very dark purple
  "#45008C", // indigo purple
  "#3C0078", // dark indigo
  "#330064", // deep indigo
  "#2A0050", // very deep purple
  "#21003C", // near-black purple

];

function preload() {
    // Indlæs data fil før programmet starter
    table = loadTable(filename, 'csv', 'header')
}

function setup() {
    // 0. SÆT TITLER I HTML
    select('#main-header').html(mainTitle)
    select('#section-1-title').html(sectionTitle1)
    select('#instruction-text').html(instructionText)
    select('#section-2-title').html(sectionTitle2)
    select('#label-x').html(colX)
    select('#label-y').html(colY)

    // -------------------------------------------------------------
    // TRIN 2: RENS DATA
    // (Forklar: Vi konverterer tekst-rækker til rigtige Javascript-objekter)
    // -------------------------------------------------------------
    var rows = table.rows
    rows = shuffle(rows).slice(0, 1000) // Vi begrænser til 1000 punkter for hastighedens skyld

    data = rows.map(row => {
        // Hent værdier fra de kolonner vi valgte i toppen
        // HUSK: Alt fra CSV er tekst, så vi bruger Number() til tallene
        var x = Number(row.get(colX))
        var y = Number(row.get(colY))
        var label = row.get(colLabel)
        
        // Tjek om data er gyldig (ikke NaN og har en label)
        if (!isNaN(x) && !isNaN(y) && label) {
            return { x, y, label }
        }
    }).filter(p => p) // Fjern tomme pladser i arrayet

    console.log("Data klar:", data.length, "punkter")
    console.log(data)
    //Console.log(data, "her er det færdig array")

    //nu skal vi forbedrede data til at blive vist ed chart.js
    //vi skal have fat i de unikke labels for hver gruppe i data
    var uniqueLabels = []
    data.map(point=> {
        // vi kigger på punktedes label, hvis vi så ikke har set det label for, må det være et unikt label
        if(!uniqueLabels.includes(point.label)){
            uniqueLabels.push(point.label)
        }   
    })

    // Sortere labels i tal ordten istedet for alalfabetisk
    uniqueLabels = uniqueLabels.sort(function(a, b) { return a - b });
    console.log('vi kiggede alle punkter igennem of fant disse labels:', uniqueLabels)


    //omdan data til grupper ud fra de forskelige labels
    var datasets = uniqueLabels.map((label,index)=>{
    //filter funktionen giver os en gruppe med et bestemt label
    var groupData = data.filter(point=> {
        return point.label == label
    })
    var col = colorList[index]

    //returner de færdige gruppe med alle datapunkterne for hvert label
    return{
        label: label,
        data: groupData,
        backgroundColor: col,
        pointRadius: 5,
        pointHoverRadius: 8
    }
    })

    //nu indsætter vi et enkelt dataset med brugerens gæt
    datasets.push({
        label: "Dit gæt",
        data: [],
        pointStyle: "crossRot",
        pointRadius: 12,
        backgroundColor: 'black',
        borderColor: 'black',
        borderWidth: 4,
    })

    console.log('så fik vi lavet dataset grupperne', datasets)

    //vi vi oprette grafen med chart.js
    const canvasChart = document.getElementById('chartCanvas')
    //så kommer vi til noget lidt objektorienteret 
    myChart = new Chart(canvasChart, {
       //Scatter er et punktdiagram i 2d
       type: 'scatter', 
       data: {datasets:datasets},
       options:{
        //scales styrer hvad x og y akserne hedder
        scales:{
            x:{title:{display:true,text:colX}},
            y:{title:{display:true,text:colY}}
        }
       }
    })

    setupControls()
}

function setupControls(){
    //1) først skal vi finde alle x og y værdierne være
    //2) eftersom vi skal bruge dem til at bestemme hvad sliderre skal gå fra og til
    //det her betyde map data arrayet og returner alle point.x værdier
    var xValues = data.map(point=> point.x)
    var yValues = data.map(point=> point.y)
    //Nu skal vi beregn mindste og største værdier
    var minX = Math.min(...xValues)
    var minY = Math.min(...yValues)
    var maxX = Math.max(...xValues)
    var maxY = Math.max(...yValues)
    console.log('her er min og max for alle data', 'minX: ', minX, 'minY: ', minY, 'maxX: ', maxX, 'maxY: ', maxY)

    var xSlider = select("#input-x")
    var ySlider = select("#input-y")

    xSlider.attribute('min', Math.floor(minX))
    xSlider.attribute('max', Math.floor(maxX))
    xSlider.value(minX + maxX / 2)
    //gør det samme men med yslideren
    ySlider.attribute('min', Math.floor(minY))
    ySlider.attribute('max', Math.floor(maxY))
    ySlider.value(minY + maxY / 2)

    //input er siderens "on change event", altså når man flytter den kaldes input funktionen
    xSlider.input(()=> select('#val-x').html(xSlider.value()))
    ySlider.input(()=> select('#val-y').html(ySlider.value()))

    select('#val-x').html(xSlider.value())
    select('#val-y').html(ySlider.value())

    //DOM binding til k-slider
   // var kSlider = select('#k-slider')
   //kSlider.input(()=>select('#k-value').html(select.value).html(select('#k-slider').value()))

    //
    var kSlider = select('#k-slider')
    kSlider.attribute('min', 1)   // Mindste k
    kSlider.attribute('max', 55)  // Maksimum k
    kSlider.value(3)              // Startværdi
    kSlider.input(()=> select('#k-value').html(kSlider.value()))

    select('#k-value').html(kSlider.value()) 
    select('#predict-btn').mousePressed(classifyUnknown)       
}

function classifyUnknown(){
    //aflæse værdierne fra sliderne og gem dem i to variabler
    var inputX = select('#input-x').value()
    var inputY = select('#input-y').value()
    
    //indsæt punktet fra sliderne i grafen
    var guessDataset = myChart.data.datasets[myChart.data.datasets.length -1]
    guessDataset.data = [{x:inputX, y:inputY}]
    
    myChart.update()

    //løb data igennem - altså allle datapunkterne og find hver og ens afstand til vores gør
    data = data.map(p=> {
        //dist ligger i p5.js og den laver pythagoras for os
        p.distance = dist(inputX, inputY, p.x, p.y)
        return p
    })
    //så sorterer vi dem så dem med mindst afstand til gættet kommer først
    //sort (a,b) => tag hvert punkt og samlign deres distance og sæt den mindste forrest
    data.sort((a,b) => a.distance - b.distance)

    //spørg de [k] nærmeste hvilken gruppe de hører til
    var k = select ('#k-slider').value()

    // nu er neighbours de første k elementer i data arrayet
    var neighbours = data.slice(0,k)

    //de stemmer om resultatet og vindereb fundet 
    //votes er et tomt objekt 
    var votes = {}
    neighbours.map(n => {
        // vi kigger nu på hvert punkts label
        //hvis det er et nyt label fr os, er vi nødt til lige at sætte dets værdi til nul
        //ellers kan vi ikke lægge point til bagefter
        if(votes[n.label]=== undefined){
            votes[n.label] = 0
        }
        votes[n.label]+=1
    })
    console.log(votes, 'her er votes')
    
    //object.keys giver s navnene på nøglerne i et objekt, idette tilfælde er det jo vores label
    var allLabels = Object.keys(votes)

    var winner = allLabels[0]

    //løb alle labelsne igennem og se hver af dem der er den vireklige venderen
    allLabels.map(l => {
        if(votes[l]> votes [winner]){
            winner = l
        }
    })

    //vis i resultat felter et hvilken klasse gætte tilhører
    console.log(winner)
    select('#winner').html(winner)
    select('#alder').html(Number(winner)+1.5)
}

