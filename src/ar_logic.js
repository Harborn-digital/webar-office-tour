import './styles/ar.scss';

function toggleOutline(status){
    if (status) {
        document.getElementById('harborn_logo_gltf').object3D.visible = false;
        document.getElementById('harborn_logo_outlined_gltf').object3D.visible = true;
    } 
    else {
        document.getElementById('harborn_logo_gltf').object3D.visible = true;
        document.getElementById('harborn_logo_outlined_gltf').object3D.visible = false;
    }
}

function toggleHighlight(status){
    if (status) {
        document.getElementById('harborn_logo_gltf').object3D.visible = false;
        document.getElementById('harborn_logo_highlighted_gltf').object3D.visible = true;
    }
    else{
        document.getElementById('harborn_logo_gltf').object3D.visible = true;
        document.getElementById('harborn_logo_highlighted_gltf').object3D.visible = false;
    }
}

function switchOption(element) {
    element.addClass('selected').siblings().removeClass('selected');
    var chosenOption = element.attr('optionClass');

    if (chosenOption === "outline") {
        toggleOutline(true);

        toggleHighlight(false);
    }
    if (chosenOption === "textColor") {
        toggleOutline(false);

        toggleHighlight(false);
    }
    if (chosenOption === "highlight") {
        toggleOutline(false);

        toggleHighlight(true);
    }
}

$('[class*=accessibility_selection]').click(function (e) {
    e.preventDefault();
    switchOption($(this));
});
