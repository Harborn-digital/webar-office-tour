import './styles/ar.scss';
var gestures = require("../js/gestures.js");
var gif = require("../js/aframe-gif-shader.min.js");

//Import objects
import Reticle from '../media/gltf/reticle/reticle.gltf';
import ReticleBin from '../media/gltf/reticle/reticle.bin';
import HarbornLogo from '../media/gltf/harborn/harborn_logo_fixed.gltf';
import HarbornLogoBin from '../media/gltf/harborn/harborn_logo_fixed.bin';
import HarbornLogoOutline from '../media/gltf/harborn/harborn_logo_outline_fixed.gltf';
import HarbornLogoBinOutline from '../media/gltf/harborn/harborn_logo_outline_fixed.bin';
import HarbornLogoHighlight from '../media/gltf/harborn/harborn_logo_highlight_fixed.gltf';
import HarbornLogoBinHighlight from '../media/gltf/harborn/harborn_logo_highlight_fixed.bin';

//Import logo wall objects
import boat from '../media/gltf/brand_models/boat/boat.gltf';
import boatBin from '../media/gltf/brand_models/boat/boat.bin';
var boatTextures = require.context('../media/gltf/brand_models/boat/textures', false, /\.png$/);
import yacht from '../media/gltf/brand_models/yacht/yacht.gltf';
import yachtBin from '../media/gltf/brand_models/yacht/yacht.bin';
var yachtTextures = require.context('../media/gltf/brand_models/yacht/textures', false, /\.(png|jpeg|jpg)$/);
import sailboat from '../media/gltf/brand_models/sailboat/sailboat.gltf';
import sailboatBin from '../media/gltf/brand_models/sailboat/sailboat.bin';
var sailboatTextures = require.context('../media/gltf/brand_models/sailboat/textures', false, /\.(png|jpeg|jpg)$/);
import yellowContainer from '../media/gltf/brand_models/container_yellow/container_yellow.gltf';
import yellowContainerBin from '../media/gltf/brand_models/container_yellow/container_yellow.bin';
var yellowContainerTextures = require.context('../media/gltf/brand_models/container_yellow/textures', false, /\.(png|jpeg|jpg)$/);
import greenContainer from '../media/gltf/brand_models/container_green/container_green.gltf';
import greenContainerBin from '../media/gltf/brand_models/container_green/container_green.bin';
var greenContainerTextures = require.context('../media/gltf/brand_models/container_green/textures', false, /\.(png|jpeg|jpg)$/);
import fries from '../media/gltf/brand_models/fries/fries.gltf';
import friesBin from '../media/gltf/brand_models/fries/fries.bin';
import potato from '../media/gltf/brand_models/potato/potato.gltf';
import potatoBin from '../media/gltf/brand_models/potato/potato.bin';
var potatoTextures = require.context('../media/gltf/brand_models/potato/textures', false, /\.(png|jpeg|jpg)$/);
import jack from '../media/gltf/brand_models/jack/jack.gltf';
import jackBin from '../media/gltf/brand_models/jack/jack.bin';
var jackTextures = require.context('../media/gltf/brand_models/jack/textures', false, /\.(png|jpeg|jpg)$/);
import pliers from '../media/gltf/brand_models/pliers/pliers.gltf';
import pliersBin from '../media/gltf/brand_models/pliers/pliers.bin';
var pliersTextures = require.context('../media/gltf/brand_models/pliers/textures', false, /\.(png|jpeg|jpg)$/);

// Test objects
import Door from '../media/gltf/testing/Door.gltf';
import DoorBin from '../media/gltf/testing/Door.bin';
import DoorOutline from '../media/gltf/testing/Door_Outlined.gltf';
import DoorOutlineBin from '../media/gltf/testing/Door_Outlined.bin';
import DoorHighlight from '../media/gltf/testing/Door_Highlighted.gltf';
import DoorHighlightBin from '../media/gltf/testing/Door_Highlighted.bin';
import Football from '../media/gltf/testing/Football.gltf';
import FootballBin from '../media/gltf/testing/Football.bin';
import FootballOutline from '../media/gltf/testing/Football_Outlined.gltf';
import FootballOutlineBin from '../media/gltf/testing/Football_Outlined.bin';
import Smiley from '../media/gltf/testing/Smiley.gltf';
import SmileyBin from '../media/gltf/testing/Smiley.bin';
import SmileyOutline from '../media/gltf/testing/Smiley_Outlined.gltf';
import SmileyOutlineBin from '../media/gltf/testing/Smiley_Outlined.bin';

let highlightState = false;
// let myIntervalId;

hideSubOptions();

function toggleOutline(status, normalModel, outlinedModel) {
    let element = document.querySelector('#' + normalModel);
    let elementOutline = document.querySelector('#' + outlinedModel);

    if (status) {
        element.object3D.visible = false;
        elementOutline.object3D.visible = true;
    }
    else if ((!status && !element) || (!status && !elementOutline)) {
        //Do nothing
    }
    else {
        element.object3D.visible = true;
        elementOutline.object3D.visible = false;
    }
}

function toggleHighlight(status, normalModel, highlightedModel) {
    let element = document.querySelector('#' + normalModel);
    let elementHighlight = document.querySelector('#' + highlightedModel);

    if (status) {
        element.object3D.visible = false;
        elementHighlight.object3D.visible = true;
        elementHighlight.setAttribute('animation', 'property: scale; dur: 1500; from: 1 1 1; to: 1.5 1.5 1.5; loop: true; dir: alternate; easing: easeInOutQuad');
        elementHighlight.setAttribute('animation__position', 'property: position; dur: 1500; from: 0 0.5 -1.5; to: 0 0.5 -2.25; loop: true; dir: alternate; easing: easeInOutQuad');
    }
    else if ((!status && !element) || (!status && !elementHighlight)) {
        //Do nothing
    }
    else {
        element.object3D.visible = true;
        elementHighlight.object3D.visible = false;
        elementHighlight.removeAttribute('animation');
    }
}

function switchOption(element) {
    var chosenOption = element.attr('optionClass');

    if (element.attr('class').includes('selected')) {
        //Turn off all effects
        toggleOutline(false, normalModelId, outlinedModelId);
        toggleHighlight(false, normalModelId, highlightedModelId);

        if (document.querySelectorAll('#' + markerId + ' .interactable').length > 0) {
            if (markerEl.children.length == 2 || markerEl.children.length == 3) {
                interactableEl = document.querySelectorAll('#' + markerId + ' .interactable')[1];
            }
            else {
                interactableEl = document.querySelectorAll('#' + markerId + ' .interactable')[0];
            }
        }

        interactableEl = document.querySelectorAll('#' + markerId + ' .interactable')[0];

        // Hide color options
        hideSubOptions();

        element.removeClass('selected').siblings().removeClass('selected');
    }
    else {
        element.addClass('selected').siblings().removeClass('selected');

        if (chosenOption === "outline") {
            toggleOutline(true, normalModelId, outlinedModelId);

            toggleHighlight(false, normalModelId, highlightedModelId);
            // removeInterval();

            if (document.querySelectorAll('#' + markerId + ' .interactable').length > 0) {
                if (markerEl.children.length == 2 || markerEl.children.length == 3) {
                    document.querySelectorAll('#' + markerId + ' .interactable')[0].object3D.visible = false;
                    interactableEl = document.querySelectorAll('#' + markerId + ' .interactable')[1];
                }
                else {
                    interactableEl = null;
                }
            }

            // Hide color options
            hideSubOptions();
        }
        if (chosenOption === "textColor") {
            toggleOutline(false, normalModelId, outlinedModelId);

            toggleHighlight(false, normalModelId, highlightedModelId);
            // removeInterval();

            interactableEl = null;

            // Show color options
            $('[class*=accessibility_color]').show();
            $('[class=accessibility_sub_line]').show();
        }
        if (chosenOption === "highlight") {
            toggleOutline(false, normalModelId, outlinedModelId);

            toggleHighlight(true, normalModelId, highlightedModelId);

            if (document.querySelectorAll('#' + markerId + ' .interactable').length > 0) {
                if (markerEl.children.length == 3) {
                    interactableEl = document.querySelectorAll('#' + markerId + ' .interactable')[2];
                }
            }
            else {
                interactableEl = null;
            }

            // Hide color options
            hideSubOptions();
        }
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
    let classNames = $(e.target).attr('class');

    if (!classNames.includes("inactive")) {
        switchOption($(this));
    }
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
        let classNames = $(e.target).attr('class');

        if (!classNames.includes("inactive")) {
            switchOption($(this));
        }
    }
});


// Set logo wall variables
var isMarkerVisible = false;
var rotationFactor = 15;
var swipeFactor = 5;
var amountRotated = 0;
var brandPosition = -1;     //-1 So on the first swipe it steps up to 0, a.k.a the first item in the brands list
var firstSwipeDone = false;
var brands = [      //Info on all the brands
    {
        name: "Marin",
        description: "MARIN, het Maritiem Research Instituut Nederland, is een van de grootste instituten ter wereld voor onderzoek naar hydrodynamica en maritieme technologie door middel van simulaties, modeltesten, ware-groottemetingen en training. MARIN richt zich hierbij op de scheepsbouw, scheepvaart, offshore-industrie en overheden.",
        image: "#marin_logo",
        gltf_left: boat,
        gltf_left_pos: '2.4 0 -2',
        gltf_left_rot: '-45 -90 90',
        gltf_left_scale: '0.003 0.003 0.003',
        gltf_left_anim: '',
        gltf_right: "sailboat",   //uncomment for model
        gltf_right_pos: '-2.2 0 -2',
        gltf_right_rot: '140 -90 90',
        gltf_right_scale: '0.001 0.001 0.001',
        gltf_right_anim: '',
    },
    {
        name: "CARU",
        description: "CARU Containers, is een Nederlands bedrijf wat internationaal containers verhuurt die nieuw of gebruikt zijn. Vanuit 10 verschillende landen bedienen zij markten over de hele wereld. Zij zijn een van de grootste containerhandelaren wereldwijd doordat zij het huren van een container simpel maken.",
        image: "#caru_logo",
        gltf_left: greenContainer,
        gltf_left_pos: '2.4 0 -2',
        gltf_left_rot: '45 -90 90',
        gltf_left_scale: '0.025 0.025 0.025',
        gltf_left_anim: '',
        gltf_right: yellowContainer,
        gltf_right_pos: '-2.2 0 -2',
        gltf_right_rot: '135 -90 90',
        gltf_right_scale: '0.003 0.003 0.003',
        gltf_right_anim: '',
    },
    {
        name: "Lamb Weston",
        description: "Lamb Weston Holdings, Inc. is een Amerikaans voedselverwerkingsbedrijf dat een van 's werelds grootste producenten en verwerkers is van diepgevroren frites, wafelfrietjes en andere diepgevroren aardappelproducten.",
        image: "#lamb_weston_logo",
        gltf_left: fries,
        gltf_left_pos: '2.4 0 -2',
        gltf_left_rot: '-45 -90 90',
        gltf_left_scale: '0.8 0.8 0.8',
        gltf_left_anim: '',
        gltf_right: "potato",       //uncomment for model
        gltf_right_pos: '-2.2 0 -2',
        gltf_right_rot: '-90 -90 90',
        gltf_right_scale: '0.1 0.1 0.1',
        gltf_right_anim: '',
    },
    {
        name: "iTanks",
        description: "iTanks is a knowledge and innovation platform for the port-related industry. An industry with enormous innovation potential. They connect companies, knowledge institutes and industry experts.",
        image: "#itanks_logo",
        gltf_left: "",
        gltf_left_pos: '2.4 0 -2',
        gltf_left_rot: '-45 -90 90',
        gltf_left_scale: '0.003 0.003 0.003',
        gltf_left_anim: '',
        gltf_right: "",
        gltf_right_pos: '-2.2 0 -2',
        gltf_right_rot: '140 -90 90',
        gltf_right_scale: '0.001 0.001 0.001',
        gltf_right_anim: '',
    },
    {
        name: "Holmatro",
        description: "Holmatro is een internationaal bedrijf dat hydraulische apparatuur en systemen produceert voor industriële toepassingen en hulpdiensten met behulp van hydraulische redgereedschappen.",
        image: "#holmatro_logo",
        gltf_left: "pliers",        //uncomment for model
        gltf_left_pos: '2.4 0 -2',
        gltf_left_rot: '-45 -90 90',
        gltf_left_scale: '0.00003 0.00003 0.00003',
        gltf_left_anim: '',
        gltf_right: jack,
        gltf_right_pos: '0 0 0',
        gltf_right_rot: '-70 -90 90',
        gltf_right_scale: '2.5 2.5 2.5',
        gltf_right_anim: 'add',
    },
    {
        name: "JMT",
        description: "JMT is een van de grootste verhuurders van meubilair en vloerbedekkingen voor evenement en beurzen in heel Europa. Wij bieden een compleet pakket aan producten, diensten en kennis. Bij JMT staat service en kwaliteit voorop zodat onze klanten succesvolle beursstand en inrichting, congressen en events in de breedste zin van het woord kunnen opleveren.",
        image: "#jmt_logo",
        gltf_left: "",
        gltf_left_pos: '2.4 0 -2',
        gltf_left_rot: '-45 -90 90',
        gltf_left_scale: '0.003 0.003 0.003',
        gltf_left_anim: '',
        gltf_right: "",
        gltf_right_pos: '-2.2 0 -2',
        gltf_right_rot: '140 -90 90',
        gltf_right_scale: '0.001 0.001 0.001',
        gltf_right_anim: '',
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
const leftModel = document.getElementById('logo_wall_model_left');
const rightModel = document.getElementById('logo_wall_model_right');

const containerButtons = document.getElementById('container-buttons');
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');
var isLogoWallVisible = false;
var markerEl = null;
var interactableEl = null;
var markerId;

var normalModelId;
var outlinedModelId;
var highlightedModelId;

sceneEl.addEventListener("onefingermove", handleRotation);              //Checks swiping on the canvas

sceneEl.addEventListener("markerFound", (e) => {                        //Checks if marker is being scanned
    isMarkerVisible = true;
    markerId = e.target.getAttribute("id");
    setOptionStates(e.target.attributes.optionState.value);

    if (e.target.attributes.value.nodeValue == 21) {
        isLogoWallVisible = true;
        showLogoWallButtons();
    }

    if (document.querySelectorAll('#' + markerId + ' .interactable').length > 0) {
        markerEl = document.querySelectorAll('#' + markerId)[0];
        interactableEl = document.querySelectorAll('#' + markerId + ' .interactable')[0];

        //Reset ID's for new marker
        normalModelId = null;
        outlinedModelId = null;
        highlightedModelId = null;

        //Set all ID's for marker children
        if (markerEl.children.length == 1) {
            normalModelId = markerEl.children[0].getAttribute('id');
        }
        if (markerEl.children.length == 2) {
            normalModelId = markerEl.children[0].getAttribute('id');
            outlinedModelId = markerEl.children[1].getAttribute('id');
        }
        if (markerEl.children.length == 3) {
            normalModelId = markerEl.children[0].getAttribute('id');
            outlinedModelId = markerEl.children[1].getAttribute('id');
            highlightedModelId = markerEl.children[2].getAttribute('id');
        }
    }
    else {
        markerEl = null;
        interactableEl = null;
    }
});

sceneEl.addEventListener("markerLost", (e) => {                         //Checks if marker is not being scanned anymore
    isMarkerVisible = false;
    setOptionStates("none");

    isLogoWallVisible = false;
    hideLogoWallButtons();
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

//Get accessibility wheel items
const outlineOption = $('#outline');
const textColorOption = $('#textColor');
const highlightOption = $('#highlight');

function hideLogoWallButtons() {
    containerButtons.style.visibility = "hidden";
    leftButton.style.visibility = "hidden";
    rightButton.style.visibility = "hidden";
}

function showLogoWallButtons() {
    containerButtons.style.visibility = "visible";
    leftButton.style.visibility = "visible";
    rightButton.style.visibility = "visible";
}

function setOptionStates(markerStateInfo) {
    //Clear all marker states
    outlineOption.removeClass('inactive');
    textColorOption.removeClass('inactive');
    highlightOption.removeClass('inactive');

    //There are three options that can be used. Each has been shortened to their first letter
    //If the letter is in the markerStateInfo, it means that the option is avaiable for that marker
    //The shortened version are; outline: O, text color: T and highlight: H
    switch (markerStateInfo) {
        case "O":
            textColorOption.addClass('inactive');
            textColorOption.removeClass('selected');
            hideSubOptions();

            highlightOption.addClass('inactive');
            highlightOption.removeClass('selected');

            break;

        case "OT":
            highlightOption.addClass('inactive');
            highlightOption.removeClass('selected');

            break;

        case "OH":
            textColorOption.addClass('inactive');
            textColorOption.removeClass('selected');
            hideSubOptions();

            break;

        case "OTH":
            break;

        case "T":
            outlineOption.addClass('inactive');
            outlineOption.removeClass('selected');
            highlightOption.addClass('inactive');
            highlightOption.removeClass('selected');

            break;

        case "TH":
            outlineOption.addClass('inactive');
            outlineOption.removeClass('selected');

            break;

        case "none":
            outlineOption.addClass('inactive');
            outlineOption.removeClass('selected');
            textColorOption.addClass('inactive');
            textColorOption.removeClass('selected');
            hideSubOptions();
            highlightOption.addClass('inactive');
            highlightOption.removeClass('selected');

            //Turn off all effects
            toggleOutline(false, normalModelId, outlinedModelId);
            toggleHighlight(false, normalModelId, highlightedModelId);

            break;
    }
}

function hideSubOptions() {
    $('[class*=accessibility_color]').hide();
    $('[class=accessibility_sub_line]').hide();
}


function handleRotation(e) {
    if (isMarkerVisible && isLogoWallVisible) {                         //Check marker scanned
        setTimeout(() => {                                              //2 seconds inactive means reset swipe
            amountRotated = 0;
        }, 2000);

        amountRotated += e.detail.positionChange.x * swipeFactor;    //Set amount swiped
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
    if (isMarkerVisible && interactableEl !== null) {
        interactableEl.object3D.rotation.x += e.detail.positionChange.y * rotationFactor;
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
    let tempLeftGltf = brands[position].gltf_left;
    let tempLeftPos = brands[position].gltf_left_pos;
    let tempLeftRot = brands[position].gltf_left_rot;
    let tempLeftScale = brands[position].gltf_left_scale;
    let tempLeftAnim = brands[position].gltf_left_anim;
    let tempRightGltf = brands[position].gltf_right;
    let tempRightPos = brands[position].gltf_right_pos;
    let tempRightRot = brands[position].gltf_right_rot;
    let tempRightScale = brands[position].gltf_right_scale;
    let tempRightAnim = brands[position].gltf_right_anim;

    if (position == 0) {
        leftButton.style.visibility = "hidden";
    }
    else if (position == brands.length - 1) {
        rightButton.style.visibility = "hidden";
    }
    else {
        leftButton.style.visibility = "visible";
        rightButton.style.visibility = "visible";
    }

    setTimeout(() => {                          //Set details when objects are out of view
        brandImage.setAttribute('src', tempImage);
        brandName.setAttribute('value', tempName);
        brandDescription.setAttribute('value', tempDescription);
        // console.log(leftModel.getAttribute('gltf-model'));
        leftModel.setAttribute('gltf-model', tempLeftGltf);
        // console.log(leftModel.getAttribute('gltf-model'));
        // leftModel.setAttribute('position', tempLeftPos);
        leftModel.setAttribute('rotation', tempLeftRot);
        leftModel.setAttribute('scale', tempLeftScale);
        rightModel.setAttribute('gltf-model', tempRightGltf);
        // rightModel.setAttribute('position', tempRightPos);
        rightModel.setAttribute('rotation', tempRightRot);
        rightModel.setAttribute('scale', tempRightScale);

        if (tempRightAnim == 'add') {
            rightModel.setAttribute('animation-mixer', 'clip: Animation');
        }

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
        brandBackground.setAttribute('width', '5');
        brandBackground.setAttribute('position', '0 0 0');
        brandName.setAttribute('position', '-2.2 1 0.2');
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