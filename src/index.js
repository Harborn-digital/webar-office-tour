import './styles/main.scss';
import {
  MediaPermissionsError,
  MediaPermissionsErrorType,
  requestMediaPermissions
} from 'mic-check';

//Import objects
import Reticle from '../media/gltf/reticle/reticle.gltf';
import ReticleBin from '../media/gltf/reticle/reticle.bin';
import HarbornLogo from '../media/gltf/Harborn/harborn_logo_fixed.gltf';
import HarbornLogoBin from '../media/gltf/harborn/harborn_logo_fixed.bin';
import HarbornLogoOutline from '../media/gltf/Harborn/harborn_logo_outline_fixed.gltf';
import HarbornLogoBinOutline from '../media/gltf/harborn/harborn_logo_outline_fixed.bin';

let ar_support;
let camera_access = false;
var font_size = 100;
var line_height_title = 46;
var line_height_text = 30;

let logoPlaced = false;

// Ar-js variables
var arToolkitSource, arToolkitContext;

navigator.mediaDevices.enumerateDevices().then(devices =>
  devices.forEach(device => {
    if (device.kind == 'audioinput' && device.label){
      //
    }
    if (device.kind == 'videoinput' && device.label){
      camera_access = true;
    } 
  }
  ));

//View controller
function showView(viewName) {
  $('[class*=container]').hide();

  if (viewName === "tutorial-main" && !ar_support) {
    $('#ar_not_supported').show();
  }
  if (viewName === "ar-view") {
    addArView();
    $('#ar-view').show();
  }
  if (viewName === "allow-camera" && camera_access) {
    $('#info-virtual').show();
  }
  else {
    $('#' + viewName).show();
  }
};

function addArView() {
  let arContainer = document.getElementById('ar-view');
  let arFrame = document.createElement('iframe');
  arFrame.setAttribute('src', 'ar.html');
  arFrame.setAttribute('class', 'ar_view_frame');

  arContainer.appendChild(arFrame);
}

$('[forward]').click(function (e) {
  e.preventDefault();
  console.log(this.id);

  if (this.id == 'allow-camera-btn' || this.id == 'allow-camera-btn-redo') {
    requestMediaPermissions()
      .then(() => {
        var viewName = $(this).attr('forward');
        showView(viewName);
      })
      .catch((err) => {
        const { type, name, message } = err;
        if (type === MediaPermissionsErrorType.SystemPermissionDenied) {
          showView('camera_not_supported');
        } else if (type === MediaPermissionsErrorType.UserPermissionDenied) {
          showView('camera_denied');
        } else if (type === MediaPermissionsErrorType.CouldNotStartVideoSource) {
          showView('camera_not_supported');
        } else {
          // not all error types are handled by this library
        }
      });
  }
  else {
    var viewName = $(this).attr('forward');
    showView(viewName);
  }
});

function switchOption(element) {
  element.addClass('selected').siblings().removeClass('selected');
  var chosenOption = element.attr('optionClass');

  if (chosenOption === "lock") {
    $('.accessibility_selection_button').hide();
    $('.accessibility_selection_icon').show();
  }
  else if (chosenOption === "magnifying") {
    $('.accessibility_selection_icon').hide();
    $('.accessibility_selection_button').show();
  }
  else {
    $('.accessibility_selection_icon').hide();
    $('.accessibility_selection_button').hide();
  }
}

$('[class*=accessibility_selection]').click(function (e) {
  e.preventDefault();
  switchOption($(this));
});

$('#text_size_up').click(function (e) {
  e.preventDefault();
  if (font_size < 120) {
    font_size += 5;
  }
  console.log(String(font_size));
  document.body.style.fontSize = String(font_size) + "%";
});

$('#text_size_down').click(function (e) {
  e.preventDefault();
  if (font_size > 100) {
    font_size -= 5;
  }
  console.log(String(font_size));
  document.body.style.fontSize = String(font_size) + "%";
});

$('#text_spacing_up').click(function (e) {
  e.preventDefault();
  if (line_height_text < 44) {
    line_height_text += 2;
    line_height_title += 2;
  }
  $('.settings_option_text').css({ "line-height": line_height_text + "px" });
  $('.information_text').css({ "line-height": line_height_text + "px" });
  $('.information_title').css({ "line-height": line_height_title + "px" });
});

$('#text_spacing_down').click(function (e) {
  e.preventDefault();
  if (line_height_text > 30) {
    line_height_text -= 2;
    line_height_title -= 2;
  }
  $('.settings_option_text').css({ "line-height": line_height_text + "px" });
  $('.information_text').css({ "line-height": line_height_text + "px" });
  $('.information_title').css({ "line-height": line_height_title + "px" });
});

// $('#activate_ar_button').click(function (e) {
//   e.preventDefault();
//   $('#ar-view').append('<a-scene embedded arjs><a-marker preset="hiro"><a-entity position="0 0 0" scale="0.05 0.05 0.05" gltf-model="https://arjs-cors-proxy.herokuapp.com/https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/scene.gltf"></a - entity > </a - marker > <a-entity camera></a-entity> </a - scene >');
// })

// animate();

// const loader = new GLTFLoader();

if (navigator.xr) {
  navigator.xr.isSessionSupported('immersive-ar')
    .then((supported) => {
      ar_support = supported;
    });
}

// var m = document.querySelector("a-marker")
// m.addEventListener("markerFound", (e) => {
//   console.log("found")
//   // location.reload();
// })

// m.addEventListener("markerLost", (e) => {
//   console.log("lost");
// })

// scene = new THREE.Scene();

// // camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
// camera = new THREE.Camera();
// scene.add(camera);

// const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
// light.position.set(0.5, 1, 0.25);
// scene.add(light);

// //

// renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.domElement.style.position = 'absolute';
// renderer.domElement.style.top = '0px'
// renderer.domElement.style.left = '0px'
// document.body.appendChild(renderer.domElement);

// //arToolkitSource setup

// arToolkitSource = new THREEx.ArToolkitSource({
//   sourceType: 'webcam',
// });

// function onResize() {
//   arToolkitSource.onResize()
//   arToolkitSource.copySizeTo(renderer.domElement)
//   if (arToolkitContext.arController !== null) {
//     arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
//   }
// }

// arToolkitSource.init(function onReady() {
//   onResize()
// });

// // handle resize event
// window.addEventListener('resize', function () {
//   onResize()
// });

// // arToolkitContext setup

// arToolkitContext = new THREEx.ArToolkitContext({
//   cameraParametersUrl: cameraDat,
//   detectionMode: 'color_and_matrix'
// });

// arToolkitContext.init(function onCompleted() {
//   camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
// });

// let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
//   type: 'pattern',
//   patternUrl: basicMarker,
// })

// scene.visible = false;

// loader.load(HarbornLogo, function (gltf) {
//   reticle.matrix.decompose(gltf.scene.position, gltf.scene.quaternion, gltf.scene.scale);
//   gltf.scene.scale.y = 0.2;
//   gltf.scene.scale.x = 0.2;
//   gltf.scene.scale.z = 0.2;
//   gltf.scene.rotation.y = -Math.PI;
//   gltf.scene.position.y = gltf.scene.parameters.height / 2;
//   HarbornLogoObj = gltf.scene;
//   scene.add(HarbornLogoObj);

// });

// loader.load(HarbornLogoOutline, function (gltf) {
//   reticle.matrix.decompose(gltf.scene.position, gltf.scene.quaternion, gltf.scene.scale);
//   gltf.scene.scale.y = 0.2;
//   gltf.scene.scale.x = 0.2;
//   gltf.scene.scale.z = 0.2;
//   gltf.scene.rotation.y = -Math.PI;
//   // gltf.scene.position.set(0 , 0 , -1);
//   HarbornLogoOutObj = gltf.scene;
//   // if (!outlineRequested) {
//   //   HarbornLogoOutObj.visible = false;
//   // }
//   scene.add(HarbornLogoOutObj);

// });

// document.getElementById("hideShow").addEventListener("click", function () {
//   if (outlineRequested) {
//     outlineRequested = false;

//     HarbornLogoObj.visible = true;
//     HarbornLogoOutObj.visible = false;
//   } else {
//     outlineRequested = true;

//     HarbornLogoObj.visible = false;
//     HarbornLogoOutObj.visible = true;
//   }
// });
// //

// // container.appendChild(ARButton.createButton(renderer, {
// //   optionalFeatures: ['dom-overlay', 'dom-overlay-for-handheld-ar'],
// //   domOverlay: { root: document.getElementById("hideShowDiv") }
// // }));

// //

// function animate() {
//   requestAnimationFrame(animate);

//   if (arToolkitSource.ready !== false)
//     arToolkitContext.update(arToolkitSource.domElement);


//   scene.visible = camera.visible;
//   renderer.render(scene, camera);
// }

// animate();