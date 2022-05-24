import './styles/ar.scss';

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
    }
    if (chosenOption === "textColor") {
        toggleOutline(false);

        toggleHighlight(false);
        // removeInterval();

        // Show color options
        $('[class*=accessibility_color]').show();
    }
    if (chosenOption === "highlight") {
        toggleOutline(false);

        toggleHighlight(true);

        // Hide color options
        $('[class*=accessibility_color]').hide();
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