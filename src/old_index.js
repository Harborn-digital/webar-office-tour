import './styles/main.scss';
// import { $ } from "../js/jquery-3.6.0.js";
import { WebXRButton } from '../js/util/webxr-button.js';
import { Scene } from '../js/render/scenes/scene.js';
import { Renderer, createWebGLContext } from '../js/render/core/renderer.js';
import { Node } from '../js/render/core/node.js';
import { Gltf2Node } from '../js/render/nodes/gltf2.js';
import { DropShadowNode } from '../js/render/nodes/drop-shadow.js';
import { vec3 } from '../js/render/math/gl-matrix.js';
import { Ray } from '../js/render/math/ray.js';
import { EffectComposer } from '../js/postprocessing/EffectComposer.js';
import { RenderPass } from '../js/postprocessing/RenderPass.js';
import { ShaderPass } from '../js/postprocessing/ShaderPass.js';
import { OutlinePass } from '../js/postprocessing/OutlinePass.js';
import { FXAAShader } from '../js/shaders/FXAAShader.js';

//Objects
import Reticle from '../media/gltf/reticle/reticle.gltf';
import HarbornLogo from '../media/gltf/Harborn/harborn_logo.gltf';
import ReticleBin from '../media/gltf/reticle/reticle.bin';
import HarbornLogoBin from '../media/gltf/harborn/harborn_logo.bin';

let ar_support;
var font_size = 100;
var line_height_title = 46;
var line_height_text = 30;

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

// XR globals.
let xrButton = null;
let xrRefSpace = null;
let xrViewerSpace = null;
let xrHitTestSource = null;

// Postprocessing globals.
let composer, effectFXAA, outlinePass;

// WebGL scene globals.
let gl = null;
let renderer = null;
let scene = new Scene();
scene.enableStats(false);

let arObject = new Node();
arObject.visible = false;
scene.addNode(arObject);

let flower = new Gltf2Node({ url: HarbornLogo });
arObject.addNode(flower);

let reticle = new Gltf2Node({ url: Reticle });
reticle.visible = false;
scene.addNode(reticle);
let reticleHitTestResult = null;

// Having a really simple drop shadow underneath an object helps ground
// it in the world without adding much complexity.
let shadow = new DropShadowNode();
vec3.set(shadow.scale, 0.15, 0.15, 0.15);
arObject.addNode(shadow);

const MAX_FLOWERS = 30;
let flowers = [];

// Ensure the background is transparent for AR.
scene.clear = false;

function initXR() {
  xrButton = new WebXRButton({
    onRequestSession: onRequestSession,
    onEndSession: onEndSession,
    textEnterXRTitle: "No thank you...",
    textXRNotFoundTitle: "AR NOT SUPPORTED",
    textExitXRTitle: "EXIT  AR",
  });
  document.querySelector('#xr_button_spawn').appendChild(xrButton.domElement);

  if (navigator.xr) {
    navigator.xr.isSessionSupported('immersive-ar')
      .then((supported) => {
        xrButton.enabled = supported;
        ar_support = supported;
      });
  }
}

function onRequestSession() {
  return navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['local', 'hit-test', 'anchors'] })
    .then((session) => {
      xrButton.setSession(session);
      onSessionStarted(session);
    });
}

function onSessionStarted(session) {
  session.addEventListener('end', onSessionEnded);
  session.addEventListener('select', onSelect);

  if (!gl) {
    gl = createWebGLContext({
      xrCompatible: true
    });

    renderer = new Renderer(gl);
    console.log(renderer);

    scene.setRenderer(renderer);
  }
  
  // postprocessing
  console.log(renderer);
  composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
  composer.addPass(outlinePass);

  // effectFXAA = new ShaderPass(FXAAShader);
  // effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
  // composer.addPass(effectFXAA);

  session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl) });

  // In this sample we want to cast a ray straight out from the viewer's
  // position and render a reticle where it intersects with a real world
  // surface. To do this we first get the viewer space, then create a
  // hitTestSource that tracks it.
  session.requestReferenceSpace('viewer').then((refSpace) => {
    xrViewerSpace = refSpace;
    session.requestHitTestSource({ space: xrViewerSpace }).then((hitTestSource) => {
      xrHitTestSource = hitTestSource;
    });
  });

  session.requestReferenceSpace('local').then((refSpace) => {
    xrRefSpace = refSpace;

    session.requestAnimationFrame(onXRFrame);
  });
}

function onEndSession(session) {
  anchoredObjects.clear();
  xrHitTestSource.cancel();
  xrHitTestSource = null;
  session.end();
}

function onSessionEnded(event) {
  xrButton.setSession(null);
}

const MAX_ANCHORED_OBJECTS = 30;
let anchoredObjects = [];
function addAnchoredObjectsToScene(anchor) {
  let flower = new Gltf2Node({ url: HarbornLogo });
  console.log(flower);

  scene.addNode(flower);
  flower.rotation.z = 40;

  anchoredObjects.push({
    anchoredObject: flower,
    anchor: anchor
  });

  // For performance reasons if we add too many objects start
  // removing the oldest ones to keep the scene complexity
  // from growing too much.
  if (anchoredObjects.length > MAX_ANCHORED_OBJECTS) {
    let objectToRemove = anchoredObjects.shift();
    scene.removeNode(objectToRemove.anchoredObject);
    objectToRemove.anchor.delete();
  }
}

let rayOrigin = vec3.create();
let rayDirection = vec3.create();
function onSelect(event) {
  if (reticle.visible) {
    // Create an anchor.
    reticleHitTestResult.createAnchor().then((anchor) => {
      addAnchoredObjectsToScene(anchor);
    }, (error) => {
      console.error("Could not create anchor: " + error);
    });
  }
}

// Called every time a XRSession requests that a new frame be drawn.
function onXRFrame(t, frame) {
  let session = frame.session;
  let pose = frame.getViewerPose(xrRefSpace);

  reticle.visible = false;

  // If we have a hit test source, get its results for the frame
  // and use the pose to display a reticle in the scene.
  if (xrHitTestSource && pose) {
    let hitTestResults = frame.getHitTestResults(xrHitTestSource);
    if (hitTestResults.length > 0) {
      let pose = hitTestResults[0].getPose(xrRefSpace);
      reticle.visible = true;
      reticle.matrix = pose.transform.matrix;
      reticleHitTestResult = hitTestResults[0];
    }
  }

  for (const { anchoredObject, anchor } of anchoredObjects) {
    // only update the object's position if it's still in the list
    // of frame.trackedAnchors
    if (!frame.trackedAnchors.has(anchor)) {
      continue;
    }
    const anchorPose = frame.getPose(anchor.anchorSpace, xrRefSpace);
    anchoredObject.matrix = anchorPose.transform.matrix;
  }

  scene.startFrame();

  session.requestAnimationFrame(onXRFrame);

  scene.drawXRFrame(frame, pose);

  scene.endFrame();
}

// Start the XR application.
initXR();