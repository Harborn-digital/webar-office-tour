import './styles/main.scss';
import * as THREE from 'three';
// import * as THREEx from '../js/ar-threex.js';
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode"
import { ARButton } from '../js/ARButton.js';
import { GLTFLoader } from '../js/GLTFLoader.js';

//Import postprocessing
import { EffectComposer } from '../js/postprocessing/EffectComposer.js';
import { RenderPass } from '../js/postprocessing/RenderPass.js';
import { ShaderPass } from '../js/postprocessing/ShaderPass.js';
import { OutlinePass } from '../js/postprocessing/OutlinePass.js';
import { FXAAShader } from '../js/shaders/FXAAShader.js';

//Import objects
import Reticle from '../media/gltf/reticle/reticle.gltf';
import ReticleBin from '../media/gltf/reticle/reticle.bin';
import HarbornLogo from '../media/gltf/Harborn/harborn_logo.gltf';
import HarbornLogoBin from '../media/gltf/harborn/harborn_logo.bin';
import HarbornLogoOutline from '../media/gltf/Harborn/harborn_logo_outline.gltf';
import HarbornLogoBinOutline from '../media/gltf/harborn/harborn_logo_outline.bin';

//Import Textures
import Tri_Pattern from './tri_pattern.jpg';
import { Vector3 } from 'three';
import Camera_Para from './camera_para.dat';
import Pattern_Bic from './pattern-bic.patt';

//Global variables
let container;
let camera, scene, renderer;
let controller;
let composer, effectFXAA, outlinePass;

let reticle;

let hitTestSource = null;
let hitTestSourceRequested = false;

let ar_support;
var font_size = 100;
var line_height_title = 46;
var line_height_text = 30;

let HarbornLogoObj = new THREE.Object3D();
let HarbornLogoOutObj = new THREE.Object3D();
let outlineRequested = false;

var strDownloadMime = "image/octet-stream";
let video;

var cameraId;

//View controller
function showView(viewName) {
  $('[class*=container]').hide();

  if (viewName === "tutorial-main" && !ar_support) {
    $('#ar_not_supported').show();
  }
  else {
    $('#' + viewName).show();
  }
};

$('[forward]').click(function (e) {
  e.preventDefault();
  var viewName = $(this).attr('forward');
  showView(viewName);
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


init();

video = document.getElementById('video');

const texture = new THREE.VideoTexture(video);

const geometry = new THREE.PlaneGeometry(16, 9);
geometry.scale(0.5, 0.5, 0.5);
const material = new THREE.MeshBasicMaterial({ map: texture });

const count = 128;
const radius = 32;

for (let i = 1, l = count; i <= l; i++) {

  const phi = Math.acos(- 1 + (2 * i) / l);
  const theta = Math.sqrt(l * Math.PI) * phi;

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.setFromSphericalCoords(radius, phi, theta);
  mesh.lookAt(0, 0, 0);
  scene.add(mesh);

}

//

// function oldMarker(){
//   var ArToolkitSource = new THREEx.ArToolkitSource({
//   sourceType: "webcam",
// });
// ArToolkitSource.init(function(){
//   setTimeout(function(){
//     ArToolkitSource.onResizeElement();
//     ArToolkitSource.copyElementSizeTo(renderer.domElement);
//   }, 2000)
// });

// var ArToolkitContext = new THREEx.ArToolkitContext({
//   cameraParametersUrl: Camera_Para,
//   detectionMode: 'color_and_matrix'
// });
// ArToolkitContext.init(function(){
//   camera.projectionMatrix.copy(ArToolkitContext.getProjectionMatrix());
// });

// var ArMarkerControls = new THREEx.ArMarkerControls(ArToolkitContext, camera,{
//   type: 'pattern',
//   patternUrl: Pattern_Bic,
//   changeMatrixMode: 'cameraTransformMatrix'
// });
// }

//

// function onScanSuccess(decodedText, decodedResult) {
//   // handle the scanned code as you like, for example:
//   console.log(`Code matched = ${decodedText}`, decodedResult);
// }

// function onScanFailure(error) {
//   // handle scan failure, usually better to ignore and keep scanning.
//   // for example:
//   console.warn(`Code scan error = ${error}`);
// }

// let html5QrcodeScanner = new Html5QrcodeScanner(
//   "qr_scanner",
//   { fps: 10, qrbox: { width: 300, height: 300 } },
//   /* verbose= */ false);

// html5QrcodeScanner.render(onScanSuccess, onScanFailure);

// document.getElementById("hideScanner").addEventListener("click", function () {
//   document.getElementById("qr_scanner").style.visibility = "hidden";
// });

// const html5QrCode = new Html5Qrcode("qr_scanner");
// // This method will trigger user permissions 
// Html5Qrcode.getCameras().then(devices => {
//   /**
//     * devices would be an array of objects of type:
//     * { id: "id", label: "label" }
//    */
//   if (devices && devices.length) {
//     console.log(devices[0].id);
//     cameraId = devices[0].id;
//     // .. use this to start scanning.
//   }
// }).catch(err => {
//   console.log(err);
//   // handle err   
// });


// html5QrCode.start(
//    cameraId, // retreived in the previous step.
//    {
//       fps: 10,    // sets the framerate to 10 frame per second 
//       qrbox: 250  // sets only 250 X 250 region of viewfinder to
//                   // scannable, rest shaded.
//  },
//  qrCodeMessage => {
//      // do something when code is read. For example:
//      console.log(`QR Code detected: ${qrCodeMessage}`);
//  },
//  errorMessage => {
//      // parse error, ideally ignore it. For example:
//      console.log(`QR Code no longer in front of camera.`);
//  })
//  .catch(err => {
//      // Start failed, handle it. For example, 
//      console.log(`Unable to start scanning, error: ${err}`);
//  });

//

animate();

function init() {
  const loader = new GLTFLoader();

  if (navigator.xr) {
    navigator.xr.isSessionSupported('immersive-ar')
      .then((supported) => {
        ar_support = supported;
      });
  }


  //save image
  var saveLink = document.createElement('div');
  saveLink.style.position = 'absolute';
  saveLink.style.top = '10px';
  saveLink.style.width = '100%';
  saveLink.style.background = '#FFFFFF';
  saveLink.style.textAlign = 'center';
  saveLink.style.zIndex = 100;
  saveLink.innerHTML =
    '<a href="#" id="saveLink">Save Frame</a>';
  document.getElementById("hideShowDiv").appendChild(saveLink);
  document.getElementById("saveLink").addEventListener('click', saveAsImage);




  let container = document.querySelector('#xr_button_spawn');
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  //

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  //

  container.appendChild(ARButton.createButton(renderer, {
    requiredFeatures: ['hit-test'],
    optionalFeatures: ['dom-overlay', 'dom-overlay-for-handheld-ar'],
    domOverlay: { root: document.getElementById("hideShowDiv") }
  }));

  //

  const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32).translate(0, 0.1, 0);

  function onSelect() {

    if (reticle.visible) {

      // const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
      // const mesh = new THREE.Mesh(geometry, material);
      // reticle.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
      // mesh.scale.y = Math.random() * 2 + 1;
      // scene.add(mesh);

      loader.load(HarbornLogo, function (gltf) {
        reticle.matrix.decompose(gltf.scene.position, gltf.scene.quaternion, gltf.scene.scale);
        gltf.scene.scale.y = 0.2;
        gltf.scene.scale.x = 0.2;
        gltf.scene.scale.z = 0.2;
        gltf.scene.rotation.y = -Math.PI;
        // gltf.scene.position.set(0 , 0 , -1);
        HarbornLogoObj = gltf.scene;
        scene.add(HarbornLogoObj);

        render();

      });

      loader.load(HarbornLogoOutline, function (gltf) {
        reticle.matrix.decompose(gltf.scene.position, gltf.scene.quaternion, gltf.scene.scale);
        gltf.scene.scale.y = 0.2;
        gltf.scene.scale.x = 0.2;
        gltf.scene.scale.z = 0.2;
        // gltf.scene.position.set(0 , 0 , -1);
        HarbornLogoOutObj = gltf.scene;
        // if (!outlineRequested) {
        //   HarbornLogoOutObj.visible = false;
        // }
        scene.add(HarbornLogoOutObj);

        // render();

      });

    }

    document.getElementById("hideShow").addEventListener("click", function () {
      if (outlineRequested) {
        outlineRequested = false;

        HarbornLogoObj.visible = true;
        HarbornLogoOutObj.visible = false;
      } else {
        outlineRequested = true;

        HarbornLogoObj.visible = false;
        HarbornLogoOutObj.visible = true;
      }
    });

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

      const constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };

      navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {

        // apply the stream to the video element used in the texture

        video.srcObject = stream;
        video.play();

      }).catch(function (error) {

        console.error('Unable to access the camera/webcam.', error);

      });

    } else {

      console.error('MediaDevices interface not available.');

    }

    getObjects();

  }

  function saveAsImage() {
    console.log("Got here");
    var imgData, imgNode;

    try {
      var strMime = "image/jpeg";
      imgData = renderer.domElement.toDataURL(strMime);

      saveFile(imgData.replace(strMime, strDownloadMime), "test.jpg");

    } catch (e) {
      console.log(e);
      return;
    }

  }

  var saveFile = function (strData, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
      document.body.appendChild(link); //Firefox requires the link to be in the body
      link.download = filename;
      link.href = strData;
      link.click();
      document.body.removeChild(link); //remove the link when done
    } else {
      location.replace(uri);
    }
  }


  controller = renderer.xr.getController(0);
  controller.addEventListener('select', onSelect);
  scene.add(controller);

  reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.2, 32).rotateX(- Math.PI / 2),
    new THREE.MeshBasicMaterial()
  );
  reticle.matrixAutoUpdate = false;
  reticle.name = "reticle";
  reticle.visible = false;
  scene.add(reticle);

  // postprocessing
  function postProcessing() {
    composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    composer.addPass(outlinePass);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(Tri_Pattern, function (texture) {

      outlinePass.patternTexture = texture;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;

    });

    effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    composer.addPass(effectFXAA);

    console.log(HarbornLogoObj);
    // console.log(selectedObjects);

    outlinePass.renderToScreen = true;
    outlinePass.selectedObjects = selectedObjects;
  }

  // onSelect();

  window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function getObjects() {
  scene.traverse(function (object) {

    if (object.isMesh) {
      console.log(object);
      if (object.name == "reticle") {
        console.log("Object reticle");
      }
      if (object.name.includes("Harborn_H_Logo_Connected")) {
        console.log("Object Harborn OBJ");
        if (outlineRequested) {
          object.visible = false;
        }
        else {
          object.visible = true;
        }
      }
      if (object.name.includes("Harborn_H_Logo_Connected_Red_Outlined")) {
        console.log("Object Harborn Outlined OBJ");
        if (outlineRequested) {
          object.visible = true;
        }
        else {
          object.visible = false;
        }
      }
      // console.log(object);
      // // object.geometry.dispose();
      // // object.material.dispose();
      // scene.remove(object);

    }

  });
  render();
}

//

function animate() {
  renderer.setAnimationLoop(render);

}

function render(timestamp, frame) {
  // ArToolkitContext.update(ArToolkitSource.domElement);
  // var context = renderer.getContext('3d')
  // console.log(context);
  // var idata = context.getImageData(0, 0, 64, 64);
  // var data = idata.data;

  // console.log(data);

  if (frame) {

    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    if (hitTestSourceRequested === false) {

      session.requestReferenceSpace('viewer').then(function (referenceSpace) {

        session.requestHitTestSource({ space: referenceSpace }).then(function (source) {

          hitTestSource = source;

        });

      });

      session.addEventListener('end', function () {

        hitTestSourceRequested = false;
        hitTestSource = null;

      });

      hitTestSourceRequested = true;

    }

    if (hitTestSource) {

      const hitTestResults = frame.getHitTestResults(hitTestSource);

      if (hitTestResults.length) {

        const hit = hitTestResults[0];

        reticle.visible = true;
        reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);

      } else {

        reticle.visible = false;

      }

    }

  }
  // composer.render(scene, camera);
  renderer.render(scene, camera);

}