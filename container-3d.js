import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const mount = document.getElementById("container3d");
const fallback = document.getElementById("viewerFallback");
const buttons = document.querySelectorAll("[data-container-model]");
const dimLength = document.getElementById("dimLength");
const dimWidth = document.getElementById("dimWidth");
const dimHeight = document.getElementById("dimHeight");
const dimCapacity = document.getElementById("dimCapacity");
const sizeWhatsapp = document.getElementById("sizeWhatsapp");

const models = {
  yard20: {
    name: "حاوية هدم وبناء 20 ياردة",
    length: 6.0,
    width: 2.4,
    height: 1.5,
    capacity: "20 ياردة",
    color: 0xf2b705,
    message: "أرغب بالاستفسار عن حاوية هدم وبناء 20 ياردة",
  },
  yard30: {
    name: "حاوية سكراب 30 ياردة",
    length: 6.7,
    width: 2.4,
    height: 1.9,
    capacity: "30 ياردة",
    color: 0xf0a400,
    message: "أرغب بالاستفسار عن حاوية سكراب 30 ياردة",
  },
  sand: {
    name: "حاوية رمل وبحص",
    length: 5.8,
    width: 2.35,
    height: 1.35,
    capacity: "توريد مواد",
    color: 0xd99a19,
    message: "أرغب بالاستفسار عن حاوية رمل وبحص",
  },
  water: {
    name: "تانك ماء",
    length: 5.2,
    width: 2.2,
    height: 2.0,
    capacity: "حسب الاحتياج",
    color: 0xf2b705,
    message: "أرغب بالاستفسار عن تأجير تانك ماء",
  },
};

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x151515, 9, 24);

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(6.6, 4.6, 8.6);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
mount.appendChild(renderer.domElement);
fallback.classList.add("is-hidden");

const ambient = new THREE.HemisphereLight(0xffffff, 0x222222, 1.9);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
keyLight.position.set(5, 8, 6);
keyLight.castShadow = true;
scene.add(keyLight);

const fillLight = new THREE.PointLight(0xf2b705, 2.2, 16);
fillLight.position.set(-4, 2, 3);
scene.add(fillLight);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(8.5, 96),
  new THREE.MeshStandardMaterial({ color: 0x202020, roughness: 0.8, metalness: 0.1 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.08;
floor.receiveShadow = true;
scene.add(floor);

const grid = new THREE.GridHelper(16, 16, 0xf2b705, 0x555555);
grid.position.y = -0.06;
grid.material.opacity = 0.28;
grid.material.transparent = true;
scene.add(grid);

let modelGroup = new THREE.Group();
scene.add(modelGroup);

const makeLabelTexture = (text) => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#171717";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f2b705";
  ctx.font = "900 82px Arial";
  ctx.textAlign = "center";
  ctx.fillText("BAAS", 256, 105);
  ctx.font = "700 34px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, 256, 160);
  ctx.font = "700 28px Arial";
  ctx.fillStyle = "#f2b705";
  ctx.fillText("0594368198", 256, 205);
  return new THREE.CanvasTexture(canvas);
};

const addBox = (group, size, pos, material) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), material);
  mesh.position.set(pos.x, pos.y, pos.z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(mesh.geometry),
    new THREE.LineBasicMaterial({ color: 0x171717, transparent: true, opacity: 0.5 })
  );
  edges.position.copy(mesh.position);
  group.add(edges);
  return mesh;
};

const addCorrugation = (group, length, width, height, material) => {
  const ribCount = Math.max(7, Math.round(length * 1.4));
  for (let i = 0; i < ribCount; i += 1) {
    const x = -length / 2 + 0.45 + (i * (length - 0.9)) / (ribCount - 1);
    addBox(group, { x: 0.045, y: height * 0.78, z: 0.055 }, { x, y: height / 2, z: width / 2 + 0.035 }, material);
    addBox(group, { x: 0.045, y: height * 0.78, z: 0.055 }, { x, y: height / 2, z: -width / 2 - 0.035 }, material);
  }
};

const createContainer = (data) => {
  const group = new THREE.Group();
  const length = data.length;
  const width = data.width;
  const height = data.height;
  const wall = 0.11;
  const yellow = new THREE.MeshStandardMaterial({
    color: data.color,
    roughness: 0.48,
    metalness: 0.34,
  });
  const dark = new THREE.MeshStandardMaterial({ color: 0x171717, roughness: 0.64, metalness: 0.22 });
  const labelMat = new THREE.MeshStandardMaterial({
    map: makeLabelTexture(data.capacity),
    roughness: 0.45,
    metalness: 0.18,
  });

  addBox(group, { x: length, y: wall, z: width }, { x: 0, y: 0, z: 0 }, dark);
  addBox(group, { x: length, y: height, z: wall }, { x: 0, y: height / 2, z: width / 2 }, yellow);
  addBox(group, { x: length, y: height, z: wall }, { x: 0, y: height / 2, z: -width / 2 }, yellow);
  addBox(group, { x: wall, y: height, z: width }, { x: length / 2, y: height / 2, z: 0 }, yellow);
  addBox(group, { x: wall, y: height * 0.82, z: width }, { x: -length / 2, y: height * 0.41, z: 0 }, yellow);
  addBox(group, { x: length * 0.36, y: height * 0.5, z: 0.018 }, { x: 0, y: height * 0.55, z: width / 2 + 0.07 }, labelMat);
  addCorrugation(group, length, width, height, yellow);

  const railY = height + 0.08;
  addBox(group, { x: length, y: 0.08, z: 0.08 }, { x: 0, y: railY, z: width / 2 }, dark);
  addBox(group, { x: length, y: 0.08, z: 0.08 }, { x: 0, y: railY, z: -width / 2 }, dark);
  addBox(group, { x: 0.12, y: 0.18, z: width * 0.62 }, { x: -length / 2 - 0.08, y: 0.35, z: 0 }, dark);

  if (data.capacity === "حسب الاحتياج") {
    group.clear();
    const tankMat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.42, metalness: 0.32 });
    const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(width / 2, width / 2, length, 48), tankMat);
    cylinder.rotation.z = Math.PI / 2;
    cylinder.position.y = height / 2;
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    group.add(cylinder);
    addBox(group, { x: length * 0.78, y: 0.2, z: width * 0.72 }, { x: 0, y: 0.15, z: 0 }, dark);
    addBox(group, { x: length * 0.32, y: height * 0.36, z: 0.02 }, { x: 0, y: height * 0.8, z: width / 2 + 0.03 }, labelMat);
  }

  group.position.y = 0.02;
  return group;
};

const setModel = (key) => {
  const data = models[key];
  scene.remove(modelGroup);
  modelGroup = createContainer(data);
  scene.add(modelGroup);
  dimLength.textContent = `${data.length.toFixed(1)} م`;
  dimWidth.textContent = `${data.width.toFixed(1)} م`;
  dimHeight.textContent = `${data.height.toFixed(1)} م`;
  dimCapacity.textContent = data.capacity;
  sizeWhatsapp.href = `https://wa.me/966594368198?text=${encodeURIComponent(data.message)}`;
};

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    setModel(button.dataset.containerModel);
  });
});

let isDragging = false;
let lastX = 0;
let targetRotation = -0.45;
let currentRotation = -0.45;
let zoom = 1;

mount.addEventListener("pointerdown", (event) => {
  isDragging = true;
  lastX = event.clientX;
  mount.setPointerCapture(event.pointerId);
});

mount.addEventListener("pointermove", (event) => {
  if (!isDragging) return;
  targetRotation += (event.clientX - lastX) * 0.008;
  lastX = event.clientX;
});

mount.addEventListener("pointerup", () => {
  isDragging = false;
});

mount.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    zoom = THREE.MathUtils.clamp(zoom + event.deltaY * 0.001, 0.72, 1.35);
  },
  { passive: false }
);

const resize = () => {
  const rect = mount.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
};

window.addEventListener("resize", resize);
resize();
setModel("yard20");

const animate = () => {
  currentRotation += (targetRotation - currentRotation) * 0.08;
  modelGroup.rotation.y = currentRotation;
  modelGroup.rotation.x = Math.sin(performance.now() * 0.0008) * 0.025;
  camera.position.set(6.6 * zoom, 4.6 * zoom, 8.6 * zoom);
  camera.lookAt(0, 1, 0);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
