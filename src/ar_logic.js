import './styles/ar.scss';

let outlineRequested = false;

if (!outlineRequested) {
    console.log(document.getElementById('harborn_logo_gltf'));
    document.getElementById('harborn_logo_gltf').object3D.visible = true;
    document.getElementById('harborn_logo_outlined_gltf').object3D.visible = false;
}

document
    .querySelector("#hideShow")
    .addEventListener("click", function () {
        if (outlineRequested) {
            outlineRequested = false;
            console.log(outlineRequested);

            document.getElementById('harborn_logo_gltf').object3D.visible = true;
            document.getElementById('harborn_logo_outlined_gltf').object3D.visible = false;
        } else {
            outlineRequested = true;
            console.log(outlineRequested);

            document.getElementById('harborn_logo_gltf').object3D.visible = false;
            document.getElementById('harborn_logo_outlined_gltf').object3D.visible = true;
        }
    });