import './styles/main.scss';
import {
  MediaPermissionsError,
  MediaPermissionsErrorType,
  requestMediaPermissions
} from 'mic-check';

//Import objects
import Reticle from '../media/gltf/reticle/reticle.gltf';
import ReticleBin from '../media/gltf/reticle/reticle.bin';
import HarbornLogo from '../media/gltf/harborn/harborn_logo_fixed.gltf';
import HarbornLogoBin from '../media/gltf/harborn/harborn_logo_fixed.bin';
import HarbornLogoOutline from '../media/gltf/harborn/harborn_logo_outline_fixed.gltf';
import HarbornLogoBinOutline from '../media/gltf/harborn/harborn_logo_outline_fixed.bin';
import HarbornLogoHighlight from '../media/gltf/harborn/harborn_logo_highlight_fixed.gltf';
import HarbornLogoBinHighlight from '../media/gltf/harborn/harborn_logo_highlight_fixed.bin';

// Test objects
import Door from '../media/gltf/testing/Door.gltf';
import DoorBin from '../media/gltf/testing/Door.bin';
import DoorOutline from '../media/gltf/testing/Door_Outlined.gltf';
import DoorOutlineBin from '../media/gltf/testing/Door_Outlined.bin';
import Football from '../media/gltf/testing/Football.gltf';
import FootballBin from '../media/gltf/testing/Football.bin';
import FootballOutline from '../media/gltf/testing/Football_Outlined.gltf';
import FootballOutlineBin from '../media/gltf/testing/Football_Outlined.bin';
import Smiley from '../media/gltf/testing/Smiley.gltf';
import SmileyBin from '../media/gltf/testing/Smiley.bin';
import SmileyOutline from '../media/gltf/testing/Smiley_Outlined.gltf';
import SmileyOutlineBin from '../media/gltf/testing/Smiley_Outlined.bin';

// Import images
import HarbornLogoQR from '../media/images/QR-circle-Harborn-Logo.png';
import HarbornLogoImage from '../media/images/HarbornIconTransparant.png';
import HarbornLogoImageRed from '../media/images/HarbornIconTransparantRed.png';
import HarbornLogoImageOutlined from '../media/images/HarbornIconTransparentOutlined.png';

let camera_access = false;
var font_size = 100;
var line_height_title = 46;
var line_height_text = 30;

let device_type;

let tutorialStep = 0;
let tutorialText = [
  'Welcome to the Harborn Office Tour Experience, in which you will learn more about Harborn and their projects.',
  'You will use your camera to scan the markers like above.',
  'When the camera successfully recognized the QR code it will load the corresponding virtual model',
  'There the model has loaded! Now we can look at the three built in accessibility features.',
  'First off we have the text color mode, which allows you to choose between three different colors. This will change all text to that color! This way you can adjust it to fit best to your preference.',
  'Next we have the highlight feature!',
  'As you can see it highlights the virtual object. It will do this with all virtual objects that can be interacted with. This way the difference between the real and virtual world can be clarified and interactables can be highlighted.',
  'Our last feature is the outline feature!',
  'This feature works similar to the highlight feature. Only this one outlines all special virtual objects. This way the shape of the object can be made extra clear!',
  'This was it for the tutorial. Enjoy the augmented reality experience and learn more about Harborn!',
]

//Set device type
function setDeviceType() {
  let ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    device_type = "tablet";
  }
  else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    device_type = "mobile";
  }
  else {
    device_type = "desktop";
  }
};

// Check if camera access is granted
navigator.mediaDevices.enumerateDevices()
  .then(devices =>
    devices.forEach(device => {
      if (device.kind == 'audioinput' && device.label) {
        //
      }
      if (device.kind == 'videoinput' && device.label) {
        camera_access = true;
      }
    }
    ));

//Check if device is a desktop, show a different starting screen if so
setDeviceType();
if (device_type === "desktop") {
  showView('unsupported_device');
};

//View controller
function showView(viewName) {
  $('[class*=container]').hide();

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
  arFrame.frameBorder = 0;

  arContainer.appendChild(arFrame);
}

function startTutorial(stap) {
  let tekstElement = $('#tutorial-text');
  let imageElement = $('#tutorial-image');
  switch (stap) {
    case 1:
      tekstElement.text(tutorialText[0]);
      break;
    case 2:
      tekstElement.text(tutorialText[1]);
      imageElement.attr('src', HarbornLogoQR);
      break;
    case 3:
      tekstElement.text(tutorialText[2]);
      break;
    case 4:
      tekstElement.text(tutorialText[3]);
      imageElement.attr('src', HarbornLogoImage);
      break;
    case 5:
      tekstElement.text(tutorialText[4]);
      break;
    case 6:
      tekstElement.text(tutorialText[5]);
      $('#highlight-tutorial').removeClass('inactive_tutorial');
      break;
    case 7:
      tekstElement.text(tutorialText[6]);
      $('#highlight-tutorial').addClass('selected_tutorial');
      $('#text-color-tutorial').removeClass('selected_tutorial');
      $('#text-color-tutorial').addClass('inactive_tutorial');
      $('[class*=accessibility_color]').hide();
      imageElement.attr('src', HarbornLogoImageRed);
      break;
    case 8:
      tekstElement.text(tutorialText[7]);
      $('#outline-tutorial').removeClass('inactive_tutorial');
      break;
    case 9:
      tekstElement.text(tutorialText[8]);
      $('#outline-tutorial').addClass('selected_tutorial');
      $('#highlight-tutorial').removeClass('selected_tutorial');
      $('#highlight-tutorial').addClass('inactive_tutorial');
      imageElement.attr('src', HarbornLogoImageOutlined);
      break;
    case 10:
      tekstElement.text(tutorialText[9]);
      break;
    case 11:
      showView("ar-view");
  }

}

$('[forward]').click(function (e) {
  e.preventDefault();

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
  if ($(this).attr('forward') === "tutorial-start") {
    var viewName = $(this).attr('forward');
    showView(viewName);
    document.body.addEventListener('click', function () {
      tutorialStep += 1;
      startTutorial(tutorialStep)
    });
  }
  else {
    var viewName = $(this).attr('forward');
    showView(viewName);
  }
});

$('#text_size_up').click(function (e) {
  e.preventDefault();
  if (font_size < 120) {
    font_size += 5;
  }
  // console.log(String(font_size));
  document.body.style.fontSize = String(font_size) + "%";
});

$('#text_size_down').click(function (e) {
  e.preventDefault();
  if (font_size > 100) {
    font_size -= 5;
  }
  // console.log(String(font_size));
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