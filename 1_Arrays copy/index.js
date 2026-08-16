var currentPage = '#page1'
var listeInput, listeHeader, listeButton, listeContainer

let elever = [ // dette er et JSON-objekt
    {navn: "Rikke", klasse: "2T", afleveret: true},
    {navn: "Peter", klasse: "2T", afleveret: true},
    {navn: "Zenia", klasse: "2T", afleveret: true},
    {navn: "Dina", klasse: "2T", afleveret: false},
    {navn: "Liv", klasse: "2T", afleveret: true}
]

function preload(){
}

//P5 setup() bliver kaldt EN gang før siden vises 
function setup(){
    console.log('P5 setup')

    //Hvor mange elementer?
    console.log(elever.length, " elementer i listen")
 
    //Sådan lægger vi nye elementer til 
    elever.push({ navn: 'Søren', klasse: '2T', afleveret: false })
    elever.push({ navn: 'Mads', klasse: '2T', afleveret: true })
    elever.push({ navn: 'John', klasse: '2T', afleveret: false })

    elever.map(function(elev) {
        (elev.afleveret == false)
            console.log(elev.navn)
        
    })
}