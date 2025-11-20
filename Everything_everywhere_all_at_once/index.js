const eyes = document.querySelectorAll(".eyes")

document.addEventListener("mousemove", (event) => {
    eyes.forEach(eye => {
        const rect = eye.getBoundingClientRect();
        
        //finder mindtpunket af hvert øje (eyes)
        const elX = rect.left + rect.width / 2;
        const elY = rect.top + rect.height / 2;

        //finder ud af hvor mousen er på skærmen (finder x og y)
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        //laver matematik for at finde vinklen, mellem mousen og øjet 
        const angle = Math.atan2(mouseY - elY, mouseX - elX) * (180 / Math.PI);

        //drejer øjet
        eye.style.transform = `rotate(${angle+90}deg)`;
    })
});

const layers = document.querySelectorAll(".face");

document.addEventListener("mousemove", (event) => {
    // Beregn musens position fra -0.5 til 0.5 på x og y
    const x = (event.clientX / window.innerWidth - 1);
    const y = (event.clientY / window.innerHeight - 1);

    layers.forEach((layer, index) => {
        // Forskellige hastigheder for hvert lag
        let speed;
        if (layer.classList.contains("baggrund")) speed = 10; 
        else if (layer.classList.contains("tekst")) speed = 15;
        else if (layer.classList.contains("dude")) speed = 20;
        else if (layer.classList.contains("maskedgirl")) speed = 30;
        else if (layer.classList.contains("evelyn")) speed = 40;

        // Flyt laget med proportional bevægelse
        const translateX = x * speed;
        const translateY = y * speed;

        layer.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
});


var theDropdown = select('#dropdown');

function setup() {
  theDropdown = createSelect();
  theDropdown.option('intro');
  theDropdown.option('cinematography');
  theDropdown.option('googly_eyes');
  theDropdown.option('quotes');
}

theDropdown.changed(() => {
    var selected = theDropdown.value();        
    var target = select('#' + selected);  
    target.elt.scrollIntoView({behavior: 'smooth'}); 
});

