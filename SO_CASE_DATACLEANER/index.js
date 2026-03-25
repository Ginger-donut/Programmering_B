//scriptet tager en CSV fil og 'cleaner' dataen så det bliver javascipt array

var table 
//cleandata vil holde det javascript objekt vi har tænkt os at bruge
var cleanData = []

const csvFile = './assets/abalone_original.csv'

// gør så vi ikke har mere end 1000 data (aka prikker) da vi skal tegne dem
const maxRows = 1000

function preload(){
    //loadTable er en p5 funktion der henter e table fra vores fil 
    table = loadTable(csvFile,'csv', 'header')
    console.log('data table loaded')

}

//Kan vi ved hjælp af machine learning-metoden KNN bestemme en abalones alder udelukkende ud fra dens længde og diameter?
function setup(){
    console.log("rå data kolonner:", table.columns)
    var yValue = "diameter"
    var xValue = "length"
    var labelValue = "rings"

    //table.rows er et array med alle data objekterne i 
    //mpt returnerer et nyt array med de dimensioner jeg genre vil have
    cleanData = table.rows.map( row => {
        var x = row.get(xValue)
        var y = row.get(yValue)
        var returnObj = {
            [xValue]: Number(x),
            [yValue]: Number(y)
        }
        if(labelValue){
            returnObj.label = Number(row.get(labelValue))
        }
        return returnObj       
    })

     //vi filterer lige arrayet så vi er sikre pp at alle de dimensioner vi skal bruge
     cleanData = cleanData.filter( row => {
        //valid er sandt, hvis begge felter er tal 
        var valid = !isNaN(row[xValue]) && !isNaN(row[yValue])
        //Dog skal vi også tjekke om label er noget, hvis vi har label
        if(labelValue && !row.label){
            valid = false
        }
        return valid
     })

     //bland data vilkårligt (p5 funktion der blader et array)
     cleanData = shuffle(cleanData)

     cleanData = cleanData.slice(0, maxRows)

    console.log('så har vi renset data', cleanData)

    select('#status').html('Vi har nu skået det ned til max 1000 rækker')
}


