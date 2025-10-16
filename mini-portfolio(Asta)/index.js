var currentPage = '#page7'

//P5 setup () bliver kladt En gang før siden vises 
function setup() {
    console.log('P5 setup kaldt Allahuakbar')
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
    
}

function shiftPage(newPage) {
    select(currentPage).removeClass('show');
    select(newPage).addClass('show');
    currentPage = newPage;
}
