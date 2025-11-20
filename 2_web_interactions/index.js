var currentPage = '#page4'

//P5 setup () bliver kladt En gang før siden vises 
function setup() {
    console.log('P5 setup kaldt Allahuakbar')
    shiftPage(currentPage);
    //Sæt menu op
    //Hent alle sider som et array
    var allPages = selectAll('.page')
    //løb listen igennem en for en 
    allPages.map (
        page => {
            //Lav et nyt <a> element
            var menuItem = createElement('a')
            //Sæt a taggets html til sidens titel
            menuItem.html(page.attribute('title'))
            //Sæt eventlistener på a tagget
            menuItem.mousePressed(
                ()=>shiftPage('#' + page.attribute('id'))
            )
            //Sæt a tagget ind i siddebaren
            select('.sidebar').child(menuItem)
        }
    )
    //Buttons
    var theButton = select('#theButton')
    //sæt en event listener op på knappen
    theButton.mousePressed( ()=>{
        if( confirm('Er du sikker?') ){
            theButton.html('ooh keep doing that😫')
        }else{
            theButton.html('Fuck you')
        }
    })

    //P5 Buttom 
    var myButtom = createButton("buttom created with javascript")
    //Drop Downs
    var theDropdown = select ('#theDropdown')
    //event listener: changed
    theDropdown.changed(()=>{
        select('#page2').style('background-color', theDropdown.value())
        })
    //Input field - DOM BINDING
    var theInput = select("#theInput")
    var theInputButton = select("#theInputButton")
    var theInputTitle = select("#theInputTitle")
    theInputButton.mousePressed(()=>{
        //Giv mig det som står i input feltet ind i variabel titlen
        var title = theInput.value()
        theInput.hide()
        theInputButton.hide()
        theInputTitle.html(title)
    })

    //checkboxes
    var ck = select("#ck1")
    ck.changed(()=>{
        ck.hide()
        select("#ckl").hide()
        select("#rebel").html("DØD OVER OPRØRET")
    })
}

function shiftPage(newPage) {
    select(currentPage).removeClass('show');
    select(newPage).addClass('show');
    currentPage = newPage;
}
