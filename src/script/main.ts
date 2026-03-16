import * as THREE from 'three';
import vertexSrc   from './shaders/vertex.glsl?raw';
import fragmentSrc from './shaders/fragment.glsl?raw';
import { defaultTheme, type Theme } from './theme';

const bg = document.getElementById('hero_bg');
const themeAttr = bg?.getAttribute('data-theme');
const parsed = themeAttr ? JSON.parse(themeAttr) : {};
const theme: Theme = {
  bg: parsed.bg ?? defaultTheme.bg,
  shape: { ...defaultTheme.shape, ...parsed.shape },
};

/* ---------- renderer ------------------------------------- */
const canvas  = document.createElement('canvas');
const gl      = canvas.getContext('webgl2')!;
const renderer = new THREE.WebGLRenderer({ canvas, context: gl, antialias: true });
bg?.appendChild(canvas);

/* ---------- uniforms ------------------------------------- */
const MAX_CLICKS = 10;
const uniforms = {
  uResolution    : { value: new THREE.Vector2() },
  uTime          : { value: 0 },
  uPixelSize     : { value: 4 },
  uColorSquare   : { value: new THREE.Color(theme.shape.square) },
  uColorCircle   : { value: new THREE.Color(theme.shape.circle) },
  uColorTriangle : { value: new THREE.Color(theme.shape.triangle) },
  uColorDiamond  : { value: new THREE.Color(theme.shape.diamond) },
  uClickPos      : { value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1)) },
  uClickTimes    : { value: new Float32Array(MAX_CLICKS) },
};

/* ---------- scene / camera / quad ------------------------ */
const scene  = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const material = new THREE.ShaderMaterial({
  vertexShader: vertexSrc,
  fragmentShader: fragmentSrc,
  uniforms,
  glslVersion: THREE.GLSL3,
  transparent: true,
});
scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

/* ---------- resize helper -------------------------------- */
const resize = () => {
  const w = canvas.clientWidth  || window.innerWidth;
  const h = canvas.clientHeight || window.innerHeight;
  renderer.setSize(w, h, false);
  uniforms.uResolution.value.set(w, h);
};
window.addEventListener('resize', resize);
resize();

/* ---------- click ripple --------------------------------- */
let clickIx = 0;
canvas.addEventListener('pointerdown', e => {
  const rect = canvas.getBoundingClientRect();
  const fx = (e.clientX - rect.left)  * (canvas.width  / rect.width);
  const fy = (rect.height - (e.clientY - rect.top)) * (canvas.height / rect.height);

  uniforms.uClickPos.value[clickIx].set(fx, fy);
  uniforms.uClickTimes.value[clickIx] = uniforms.uTime.value;
  clickIx = (clickIx + 1) % MAX_CLICKS;
});

/* ---------- main loop ------------------------------------ */
const clock = new THREE.Clock();
(function animate() {
  uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
})();
