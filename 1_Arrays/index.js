function preload(){
}

//P5 setup() bliver kaldt EN gang før siden vises 
function setup(){
    
    //Vi opretter et array med firkantede paranteser
    
 let elever = [ // dette er et JSON-objekt
    {navn: "Rikke", klasse: "2T", afleveret: true},
    {navn: "Peter", klasse: "2T", afleveret: true},
    {navn: "Zenia", klasse: "2T", afleveret: true},
    {navn: "Dina", klasse: "2T", afleveret: false},
    {navn: "Liv", klasse: "2T", afleveret: true}
]

    //Sådan lægger vi nye elementer til 
    elever.push({ navn: 'Søren', klasse: '2T', afleveret: false })
    elever.push({ navn: 'John', klasse: '2T', afleveret: false })

    elever.map(function(elever){
        if (elever.afleveret === false) {
            console.log(elever.navn)
        }
    })

}
