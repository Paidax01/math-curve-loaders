const PARTICLE_COUNT = 64;
const BASE_RADIUS = 7;
const PETALS = 7;
const DETAIL = 3;
const SCALE = 3.9;
const TRAIL_SPAN = 0.38;
const ROTATION_DURATION_MS = 28000;
const PULSE_DURATION_MS = 4200;
const DURATION_MS = 4600;

const svgNamespace = "http://www.w3.org/2000/svg";
const rotatingGroup = document.querySelector("#rotating-group");
const backgroundPath = document.querySelector("#background-path");

function normalizeProgress(progress) {
  return ((progress % 1) + 1) % 1;
}

function getPoint(progress, detailScale) {
  const t = normalizeProgress(progress) * Math.PI * 2;
  const x = BASE_RADIUS * Math.cos(t) - DETAIL * detailScale * Math.cos(PETALS * t);
  const y = BASE_RADIUS * Math.sin(t) - DETAIL * detailScale * Math.sin(PETALS * t);

  return {
    x: 50 + x * SCALE,
    y: 50 + y * SCALE,
  };
}

function buildPath(detailScale, steps = 360) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const point = getPoint(index / steps, detailScale);
    return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }).join(" ");
}

function getDetailScale(time) {
  const pulseProgress = (time % PULSE_DURATION_MS) / PULSE_DURATION_MS;
  const pulseAngle = pulseProgress * Math.PI * 2;
  return 0.5 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.45;
}

function getRotation(time) {
  return -((time % ROTATION_DURATION_MS) / ROTATION_DURATION_MS) * 360;
}

function getParticle(index, progress, detailScale) {
  const tailOffset = index / (PARTICLE_COUNT - 1);
  const point = getPoint(progress - tailOffset * TRAIL_SPAN, detailScale);
  const fade = Math.pow(1 - tailOffset, 0.58);

  return {
    x: point.x,
    y: point.y,
    radius: 1.05 + fade * 2.75,
    opacity: 0.08 + fade * 0.92,
  };
}

const particleNodes = Array.from({ length: PARTICLE_COUNT }, () => {
  const circle = document.createElementNS(svgNamespace, "circle");
  circle.setAttribute("fill", "currentColor");
  rotatingGroup.appendChild(circle);
  return circle;
});

function renderFrame(time) {
  const progress = (time % DURATION_MS) / DURATION_MS;
  const detailScale = getDetailScale(time);
  const rotation = getRotation(time);

  rotatingGroup.setAttribute("transform", `rotate(${rotation} 50 50)`);
  backgroundPath.setAttribute("d", buildPath(detailScale));

  particleNodes.forEach((node, index) => {
    const particle = getParticle(index, progress, detailScale);
    node.setAttribute("cx", particle.x.toFixed(2));
    node.setAttribute("cy", particle.y.toFixed(2));
    node.setAttribute("r", particle.radius.toFixed(2));
    node.setAttribute("opacity", particle.opacity.toFixed(3));
  });
}

const startedAt = performance.now();

function tick(now) {
  renderFrame(now - startedAt);
  window.requestAnimationFrame(tick);
}

renderFrame(0);
window.requestAnimationFrame(tick);
