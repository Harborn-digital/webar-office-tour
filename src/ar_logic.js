import './styles/ar.scss';
var gestures = require("../js/gestures.js");
var gif = require("../js/aframe-gif-shader.min.js");

let highlightState = false;
// let myIntervalId;

function toggleOutline(status) {
    if (status) {
        document.getElementById('harborn_logo_gltf').object3D.visible = false;
        document.getElementById('harborn_logo_outlined_gltf').object3D.visible = true;

        document.getElementById('door_gltf').object3D.visible = false;
        document.getElementById('door_outlined_gltf').object3D.visible = true;

        document.getElementById('football_gltf').object3D.visible = false;
        document.getElementById('football_outlined_gltf').object3D.visible = true;

        document.getElementById('smiley_gltf').object3D.visible = false;
        document.getElementById('smiley_outlined_gltf').object3D.visible = true;
    }
    else {
        document.getElementById('harborn_logo_gltf').object3D.visible = true;
        document.getElementById('harborn_logo_outlined_gltf').object3D.visible = false;

        document.getElementById('door_gltf').object3D.visible = true;
        document.getElementById('door_outlined_gltf').object3D.visible = false;

        document.getElementById('football_gltf').object3D.visible = true;
        document.getElementById('football_outlined_gltf').object3D.visible = false;

        document.getElementById('smiley_gltf').object3D.visible = true;
        document.getElementById('smiley_outlined_gltf').object3D.visible = false;
    }
}

function toggleHighlight(status) {
    let element = document.querySelector('#harborn_logo_gltf');
    let elementHighlight = document.querySelector('#harborn_logo_highlighted_gltf');

    if (status) {
        element.object3D.visible = false;
        elementHighlight.object3D.visible = true;
        elementHighlight.setAttribute('animation', 'property: scale; dur: 1500; from: 1 1 1; to: 1.5 1.5 1.5; loop: true; dir: alternate; easing: easeInOutQuad');
        elementHighlight.setAttribute('animation__position', 'property: position; dur: 1500; from: 0 0.5 -1.5; to: 0 0.5 -2.25; loop: true; dir: alternate; easing: easeInOutQuad');
    }
    else {
        element.object3D.visible = true;
        elementHighlight.object3D.visible = false;
        elementHighlight.removeAttribute('animation');
    }
}


function switchOption(element) {
    element.addClass('selected').siblings().removeClass('selected');
    var chosenOption = element.attr('optionClass');

    if (chosenOption === "outline") {
        toggleOutline(true);

        toggleHighlight(false);
        // removeInterval();

        // Hide color options
        $('[class*=accessibility_color]').hide();
        $('[class=accessibility_sub_line]').hide();
    }
    if (chosenOption === "textColor") {
        toggleOutline(false);

        toggleHighlight(false);
        // removeInterval();

        // Show color options
        $('[class*=accessibility_color]').show();
        $('[class=accessibility_sub_line]').show();
    }
    if (chosenOption === "highlight") {
        toggleOutline(false);

        toggleHighlight(true);

        // Hide color options
        $('[class*=accessibility_color]').hide();
        $('[class=accessibility_sub_line]').hide();
    }
}

function switchColors(element) {
    element.addClass('active').siblings().removeClass('active');
    var chosenColor = element.attr('chosenColor');

    $('a-text').each(function () {
        if ($(this).attr('isTitle') !== "true") {
            $(this).attr('color', chosenColor);
        }
    })
}

$('[class*=accessibility_color]').click(function (e) {
    e.preventDefault();
    switchColors($(this));
});

$('[class*=accessibility_selection]').click(function (e) {
    e.preventDefault();
    switchOption($(this));
});

// Accessibility click events
$('[class*=accessibility_color]').keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
        switchColors($(this));
    }
});

$('[class*=accessibility_selection]').keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
        switchOption($(this));
    }
});


// Set logo wall variables
var isMarkerVisible = false;
var rotationFactor = 5;
var amountRotated = 0;
var brandPosition = -1;     //-1 So on the first swipe it steps up to 0, a.k.a the first item in the brands list
var firstSwipeDone = false;
var brands = [      //Info on all the brands
    {
        name: "Marin",
        description: "MARIN, het Maritiem Research Instituut Nederland, is een van de grootste instituten ter wereld voor onderzoek naar hydrodynamica en maritieme technologie door middel van simulaties, modeltesten, ware-groottemetingen en training. MARIN richt zich hierbij op de scheepsbouw, scheepvaart, offshore-industrie en overheden.",
        image: "#marin_logo",
    },
    {
        name: "CARU",
        description: "CARU Containers, is een Nederlands bedrijf wat internationaal containers verhuurt die nieuw of gebruikt zijn. Vanuit 10 verschillende landen bedienen zij markten over de hele wereld. Zij zijn een van de grootste containerhandelaren wereldwijd doordat zij het huren van een container simpel maken.",
        image: "#caru_logo",
    },
    {
        name: "Lamb Weston",
        description: "Lamb Weston Holdings, Inc. is een Amerikaans voedselverwerkingsbedrijf dat een van 's werelds grootste producenten en verwerkers is van diepgevroren frites, wafelfrietjes en andere diepgevroren aardappelproducten.",
        image: "#lamb_weston_logo",
    },
    {
        name: "iTanks",
        description: "iTanks is a knowledge and innovation platform for the port-related industry. An industry with enormous innovation potential. They connect companies, knowledge institutes and industry experts and introduce these parties with new technology and the latest innovations from within and outside the sector. In addition, their strength lies in the renewal of the port-related industry. There is an enormous amount of knowledge and expertise available, the application areas of which are not yet (optimally) used for industry.",
        image: "#itanks_logo",
    },
    {
        name: "Holmatro",
        description: "Holmatro is een internationaal bedrijf dat hydraulische apparatuur en systemen produceert voor industriële toepassingen en hulpdiensten met behulp van hydraulische redgereedschappen.",
        image: "#holmatro_logo",
    },
    {
        name: "JMT",
        description: "JMT is een van de grootste verhuurders van meubilair en vloerbedekkingen voor evenement en beurzen in heel Europa. Wij bieden een compleet pakket aan producten, diensten en kennis. Bij JMT staat service en kwaliteit voorop zodat onze klanten succesvolle beursstand en inrichting, congressen en events in de breedste zin van het woord kunnen opleveren.",
        image: "#jmt_logo",
    }
]

// Get logo wall elements
const sceneEl = document.getElementById('scene');
const logoMarkerEl = document.getElementById('logo_marker');
const brandImage = document.getElementById('company_image');
const imageBackground = document.getElementById('image_plane');
const brandName = document.getElementById('company_name');
const brandDescription = document.getElementById('company_description');
const brandBackground = document.getElementById('company_background');
const swipingGif = document.getElementById('swiping_gif');

const containerButtons = document.getElementById('container-buttons');
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');

sceneEl.addEventListener("onefingermove", handleRotation);              //Checks swiping on the canvas

sceneEl.addEventListener("markerFound", (e) => {                        //Checks if marker is being scanned
    isMarkerVisible = true;

    if (e.target.attributes.value.nodeValue == 21) {
        containerButtons.style.visibility = "visible";
    }
});

sceneEl.addEventListener("markerLost", (e) => {                         //Checks if marker is not being scanned anymore
    isMarkerVisible = false;
    containerButtons.style.visibility = "hidden";
});

leftButton.addEventListener('click', function (e) {
    if (firstSwipeDone) {
        switchBrand(-1)
    }
    if (!firstSwipeDone) {
        removeSwipingGIF();
        switchBrand(1);
    }
});
rightButton.addEventListener('click', function (e) {
    if (firstSwipeDone) {
        switchBrand(1)
    }
    if (!firstSwipeDone) {
        removeSwipingGIF();
        switchBrand(1);
    }
});

function handleRotation(e) {
    if (isMarkerVisible) {                                              //Check marker scanned
        setTimeout(() => {                                              //2 seconds inactive means reset swipe
            amountRotated = 0;
        }, 2000);

        amountRotated += e.detail.positionChange.x * rotationFactor;    //Set amount swiped
        // console.log("Amount rotated: " + amountRotated);

        if (amountRotated >= 1 && firstSwipeDone) {
            amountRotated = 0;                                          //Reset swipe
            switchBrand(1);
        }
        else if (amountRotated <= -1 && firstSwipeDone) {
            amountRotated = 0;
            switchBrand(-1);
        }
        else if (amountRotated >= 1 && !firstSwipeDone) {
            amountRotated = 0;
            removeSwipingGIF();
            switchBrand(1);
        }
        else if (amountRotated <= -1 && !firstSwipeDone) {
            amountRotated = 0;
            removeSwipingGIF();
            switchBrand(1);
        }
    }
}

function switchBrand(positionChange) {                  //Update brand number from list
    brandPosition += positionChange;

    if (brandPosition < 0) {                            //Block when first item has been reached
        brandPosition = 0;
    }
    else if (brandPosition > brands.length - 1) {       //Block when last item has been reached
        brandPosition = brands.length - 1;
    }
    else {                                              //Change details
        animateBrandChange(positionChange);
        changeBrandData(brandPosition);
    }
}

function animateBrandChange(rotationDirection) {
    if (rotationDirection > 0) {                            //Animate to the right
        var markerZ = logoMarkerEl.object3D.position.z;     //Get marker positions
        var markerY = logoMarkerEl.object3D.position.y;
        logoMarkerEl.setAttribute('animation', "property: position; from: 0 " + markerY + " " + markerZ + "; to:8 0 " + markerZ + "; dur: 500; easing: linear;");
        setTimeout(() => {                                  //Animation from other side, plays when previous has finished
            logoMarkerEl.removeAttribute('animation');
            logoMarkerEl.setAttribute('animation', "property: position; from: -8 " + markerY + " " + markerZ + "; to:0 0 " + markerZ + "; dur: 500; easing: linear;");
        }, 500);
    }
    if (rotationDirection < 0) {                            //Animate to the left
        var markerZ = logoMarkerEl.object3D.position.z;
        var markerY = logoMarkerEl.object3D.position.y;
        logoMarkerEl.setAttribute('animation', "property: position; from: 0 " + markerY + " " + markerZ + "; to:-8 0 " + markerZ + "; dur: 500; easing: linear;");
        setTimeout(() => {
            logoMarkerEl.removeAttribute('animation');
            logoMarkerEl.setAttribute('animation', "property: position; from: 8 " + markerY + " " + markerZ + "; to:0 0 " + markerZ + "; dur: 500; easing: linear;");
        }, 500);
    }
}

function changeBrandData(position) {
    let tempName = brands[position].name;       //Get info from the JSON list
    let tempDescription = brands[position].description;
    let tempImage = brands[position].image;

    setTimeout(() => {                          //Set details when objects are out of view
        brandImage.setAttribute('src', tempImage);
        brandName.setAttribute('value', tempName);
        brandDescription.setAttribute('value', tempDescription);
    }, 500);
}

function removeSwipingGIF() {
    firstSwipeDone = true;

    setTimeout(() => {      //Set details when objects are out of view
        // Set image
        brandImage.setAttribute('visible', 'true');
        brandImage.object3D.position.z = -3;
        imageBackground.setAttribute('visible', 'true');

        // Remove GIF
        swipingGif.setAttribute('visible', 'false');

        // Set brand details
        brandBackground.setAttribute('height', '2.5');
        brandBackground.setAttribute('width', '3');
        brandBackground.setAttribute('position', '0 0 0');
        brandName.setAttribute('position', '-1.35 1 0.2');
    }, 500);
}

// Toggle highlight chaning model

// function toggleHighlight(status) {
//     if (status && !myIntervalId) {
//         myIntervalId = setInterval(flashHighlight, 1500);
//     }
//     else {
//         document.getElementById('harborn_logo_gltf').object3D.visible = true;
//         document.getElementById('harborn_logo_highlighted_gltf').object3D.visible = false;
//     }
// }

// function removeInterval(){
//     clearInterval(myIntervalId);
//     myIntervalId = null;
// }

// function flashHighlight(){
//     console.log(myIntervalId);
//     if (highlightState) {
//         highlightState = !highlightState;
//         document.getElementById('harborn_logo_gltf').object3D.visible = true;
//         document.getElementById('harborn_logo_highlighted_gltf').object3D.visible = false;
//     }
//     else{
//         highlightState = !highlightState
//         document.getElementById('harborn_logo_gltf').object3D.visible = false;
//         document.getElementById('harborn_logo_highlighted_gltf').object3D.visible = true;
//     }
// }