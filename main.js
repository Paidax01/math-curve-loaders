const SVG_NS = "http://www.w3.org/2000/svg";
const gallery = document.querySelector("#gallery");
const viewerModal = document.querySelector("#viewer-modal");
const viewerBackdrop = document.querySelector("#viewer-backdrop");
const viewer = document.querySelector("#viewer");
const viewerGroup = document.querySelector("#viewer-group");
const viewerPath = document.querySelector("#viewer-path");
const viewerTitle = document.querySelector("#viewer-title");
const viewerTag = document.querySelector("#viewer-tag");
const viewerDesc = document.querySelector("#viewer-desc");
const viewerFormula = document.querySelector("#viewer-formula");
const viewerCode = document.querySelector("#viewer-code code");
const viewerCopy = document.querySelector("#viewer-copy");
const viewerClose = document.querySelector("#viewer-close");
let openAnimationFrame = 0;

const curves = [
  {
    name: "Original Thinking",
    tag: "Custom Rose Trail",
    description: "你最初那版花瓣粒子轨迹，作为整个画廊的起点保留下来。",
    formula: [
      "x(t) = 50 + (7 cos t - 3s cos 7t) * 3.9",
      "y(t) = 50 + (7 sin t - 3s sin 7t) * 3.9",
      "s = detailScale(time)",
    ].join("\n"),
    rotate: true,
    particleCount: 64,
    trailSpan: 0.38,
    durationMs: 4600,
    rotationDurationMs: 28000,
    pulseDurationMs: 4200,
    strokeWidth: 5.5,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const x = 7 * Math.cos(t) - 3 * detailScale * Math.cos(7 * t);
      const y = 7 * Math.sin(t) - 3 * detailScale * Math.sin(7 * t);
      return {
        x: 50 + x * 3.9,
        y: 50 + y * 3.9,
      };
    },
  },
  {
    name: "Rose Orbit",
    tag: "r = cos(kθ)",
    description: "玫瑰线的花瓣结构，保留了你原来那种旋转中的花感。",
    formula: [
      "r(t) = 7 - 2.7s cos(7t)",
      "x(t) = 50 + cos t · r(t) · 3.9",
      "y(t) = 50 + sin t · r(t) · 3.9",
    ].join("\n"),
    rotate: false,
    particleCount: 72,
    trailSpan: 0.42,
    durationMs: 5200,
    rotationDurationMs: 30000,
    pulseDurationMs: 4600,
    strokeWidth: 5.2,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const r = 7 - 2.7 * detailScale * Math.cos(7 * t);
      return {
        x: 50 + Math.cos(t) * r * 3.9,
        y: 50 + Math.sin(t) * r * 3.9,
      };
    },
  },
  {
    name: "Lissajous Drift",
    tag: "x = sin(at), y = sin(bt)",
    description: "更像电子示波器里的轨迹，路径穿插感更强。",
    formula: [
      "A = 24 + 6s",
      "x(t) = 50 + sin(3t + π/2) · A",
      "y(t) = 50 + sin(4t) · 0.92A",
    ].join("\n"),
    rotate: false,
    particleCount: 68,
    trailSpan: 0.34,
    durationMs: 6000,
    rotationDurationMs: 36000,
    pulseDurationMs: 5400,
    strokeWidth: 4.7,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const amp = 24 + detailScale * 6;
      return {
        x: 50 + Math.sin(3 * t + Math.PI / 2) * amp,
        y: 50 + Math.sin(4 * t) * (amp * 0.92),
      };
    },
  },
  {
    name: "Lemniscate Bloom",
    tag: "Bernoulli Lemniscate",
    description: "双纽线像一个呼吸中的无限符号，节奏更优雅。",
    formula: [
      "a = 20 + 7s",
      "x(t) = 50 + a cos t / (1 + sin² t)",
      "y(t) = 50 + a sin t cos t / (1 + sin² t)",
    ].join("\n"),
    rotate: false,
    particleCount: 70,
    trailSpan: 0.4,
    durationMs: 5600,
    rotationDurationMs: 34000,
    pulseDurationMs: 5000,
    strokeWidth: 4.8,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const scale = 20 + detailScale * 7;
      const denom = 1 + Math.sin(t) ** 2;
      return {
        x: 50 + (scale * Math.cos(t)) / denom,
        y: 50 + (scale * Math.sin(t) * Math.cos(t)) / denom,
      };
    },
  },
  {
    name: "Hypotrochoid Loop",
    tag: "Inner Spirograph",
    description: "内旋轮线会生成更复杂的卷曲回环，机械感更明显。",
    formula: [
      "x(t) = 50 + ((R-r) cos t + d cos((R-r)t/r)) · 3.05",
      "y(t) = 50 + ((R-r) sin t - d sin((R-r)t/r)) · 3.05",
      "R = 8.2, r = 2.7 + 0.45s, d = 4.8 + 1.2s",
    ].join("\n"),
    rotate: false,
    particleCount: 82,
    trailSpan: 0.46,
    durationMs: 7600,
    rotationDurationMs: 42000,
    pulseDurationMs: 6200,
    strokeWidth: 4.6,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const R = 8.2;
      const r = 2.7 + detailScale * 0.45;
      const d = 4.8 + detailScale * 1.2;
      const x = (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
      const y = (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
      return {
        x: 50 + x * 3.05,
        y: 50 + y * 3.05,
      };
    },
  },
  {
    name: "Butterfly Phase",
    tag: "Butterfly Curve",
    description: "蝴蝶曲线最有生命感，粒子会像在拍动翅膀。",
    formula: [
      "u = 12t",
      "B(u) = e^{cos u} - 2 cos 4u - sin^5(u/12)",
      "x(t) = 50 + sin u · B(u) · (4.6 + 0.45s)",
      "y(t) = 50 + cos u · B(u) · (4.6 + 0.45s)",
    ].join("\n"),
    rotate: false,
    particleCount: 88,
    trailSpan: 0.32,
    durationMs: 9000,
    rotationDurationMs: 50000,
    pulseDurationMs: 7000,
    strokeWidth: 4.4,
    point(progress, detailScale) {
      const t = progress * Math.PI * 12;
      const s =
        Math.exp(Math.cos(t)) -
        2 * Math.cos(4 * t) -
        Math.sin(t / 12) ** 5;
      const scale = 4.6 + detailScale * 0.45;
      return {
        x: 50 + Math.sin(t) * s * scale,
        y: 50 + Math.cos(t) * s * scale,
      };
    },
  },
  {
    name: "Cardioid Glow",
    tag: "Cardioid",
    description: "心形线像向内聚拢再释放的呼吸波，情绪感更强。",
    formula: [
      "a = 8.4 + 0.8s",
      "r(t) = a(1 - cos t)",
      "x(t) = 50 + cos t · r(t) · 2.15",
      "y(t) = 50 + sin t · r(t) · 2.15",
    ].join("\n"),
    rotate: false,
    particleCount: 72,
    trailSpan: 0.36,
    durationMs: 6200,
    rotationDurationMs: 36000,
    pulseDurationMs: 5200,
    strokeWidth: 4.9,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const a = 8.4 + detailScale * 0.8;
      const r = a * (1 - Math.cos(t));
      return {
        x: 50 + Math.cos(t) * r * 2.15,
        y: 50 + Math.sin(t) * r * 2.15,
      };
    },
  },
  {
    name: "Spiral Search",
    tag: "Archimedean Spiral",
    description: "改成闭环的螺旋感轨迹后，保留搜索扩散感，也不会有被截断的跳变。",
    formula: [
      "θ(t) = 4t",
      "r(t) = 8 + (1 - cos t)(8.5 + 2.4s)",
      "x(t) = 50 + cos θ · r(t)",
      "y(t) = 50 + sin θ · r(t)",
    ].join("\n"),
    rotate: false,
    particleCount: 86,
    trailSpan: 0.28,
    durationMs: 7800,
    rotationDurationMs: 44000,
    pulseDurationMs: 6800,
    strokeWidth: 4.3,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const angle = t * 4;
      const radius = 8 + (1 - Math.cos(t)) * (8.5 + detailScale * 2.4);
      return {
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius,
      };
    },
  },
  {
    name: "Nautilus Drift",
    tag: "Logarithmic Spiral",
    description: "保留贝壳感，但改成周期闭合的增长收缩，让循环更丝滑。",
    formula: [
      "θ(t) = 3t",
      "g(t) = exp(0.32 sin t)",
      "r(t) = (8.5 + 2.1s)g(t)",
      "x(t) = 50 + cos θ · r(t), y(t) = 50 + sin θ · r(t)",
    ].join("\n"),
    rotate: false,
    particleCount: 90,
    trailSpan: 0.24,
    durationMs: 8600,
    rotationDurationMs: 46000,
    pulseDurationMs: 7000,
    strokeWidth: 4.1,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const angle = t * 3;
      const growth = Math.exp(0.32 * Math.sin(t));
      const r = (8.5 + detailScale * 2.1) * growth;
      return {
        x: 50 + Math.cos(angle) * r,
        y: 50 + Math.sin(angle) * r,
      };
    },
  },
  {
    name: "Astroid Star",
    tag: "Astroid",
    description: "星形线有很强的图标感，四个尖角会显得很利落。",
    formula: [
      "a = 28 + 4s",
      "x(t) = 50 + a cos³ t",
      "y(t) = 50 + a sin³ t",
    ].join("\n"),
    rotate: false,
    particleCount: 68,
    trailSpan: 0.41,
    durationMs: 5400,
    rotationDurationMs: 32000,
    pulseDurationMs: 4800,
    strokeWidth: 5.0,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const a = 28 + detailScale * 4;
      return {
        x: 50 + a * Math.cos(t) ** 3,
        y: 50 + a * Math.sin(t) ** 3,
      };
    },
  },
  {
    name: "Superellipse Morph",
    tag: "Superellipse",
    description: "圆角方形与菱形之间不断变换，科技产品感很强。",
    formula: [
      "n = 2.2 + 2.1s",
      "x(t) = 50 + a · sign(cos t) · |cos t|^{2/n}",
      "y(t) = 50 + b · sign(sin t) · |sin t|^{2/n}",
      "a = b = 26",
    ].join("\n"),
    rotate: false,
    particleCount: 80,
    trailSpan: 0.37,
    durationMs: 6400,
    rotationDurationMs: 38000,
    pulseDurationMs: 5600,
    strokeWidth: 4.6,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const a = 26;
      const b = 26;
      const exponent = 2.2 + detailScale * 2.1;
      const cosT = Math.cos(t);
      const sinT = Math.sin(t);
      const x = a * Math.sign(cosT) * Math.abs(cosT) ** (2 / exponent);
      const y = b * Math.sign(sinT) * Math.abs(sinT) ** (2 / exponent);
      return {
        x: 50 + x,
        y: 50 + y,
      };
    },
  },
  {
    name: "Hypocycloid Crest",
    tag: "Hypocycloid",
    description: "多尖内摆线有很强的符号感，轨迹干净又锋利。",
    formula: [
      "x(t) = 50 + ((R-r) cos t + r cos((R-r)t/r)) · 3.35",
      "y(t) = 50 + ((R-r) sin t - r sin((R-r)t/r)) · 3.35",
      "R = 9.6, r = 2.4 + 0.18s",
    ].join("\n"),
    rotate: false,
    particleCount: 72,
    trailSpan: 0.39,
    durationMs: 5600,
    rotationDurationMs: 32000,
    pulseDurationMs: 5000,
    strokeWidth: 4.8,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const R = 9.6;
      const r = 2.4 + detailScale * 0.18;
      const x = (R - r) * Math.cos(t) + r * Math.cos(((R - r) / r) * t);
      const y = (R - r) * Math.sin(t) - r * Math.sin(((R - r) / r) * t);
      return {
        x: 50 + x * 3.35,
        y: 50 + y * 3.35,
      };
    },
  },
  {
    name: "Cassini Bloom",
    tag: "Cassini Oval",
    description: "卡西尼卵形能在单环与双环观感之间摆动，呼吸感很漂亮。",
    formula: [
      "ρ²(t) = a² cos 2t + √(b⁴ - a⁴ sin² 2t)",
      "r(t) = √ρ²(t)",
      "x(t) = 50 + cos t · r(t) · 1.45",
      "y(t) = 50 + sin t · r(t) · 1.45",
    ].join("\n"),
    rotate: false,
    particleCount: 84,
    trailSpan: 0.35,
    durationMs: 6600,
    rotationDurationMs: 36000,
    pulseDurationMs: 5600,
    strokeWidth: 4.5,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const a = 13.2 + detailScale * 2.2;
      const b = 18.5 + detailScale * 2.8;
      const value = Math.sqrt(
        Math.max(
          0.0001,
          b ** 4 - a ** 4 * Math.sin(2 * t) ** 2
        )
      );
      const r = Math.sqrt(
        Math.max(0.0001, a ** 2 * Math.cos(2 * t) + value)
      );
      return {
        x: 50 + Math.cos(t) * r * 1.45,
        y: 50 + Math.sin(t) * r * 1.45,
      };
    },
  },
  {
    name: "Nephroid Tide",
    tag: "Nephroid",
    description: "肾形线像被潮汐推拉的封闭轨迹，圆润里带一点怪趣味。",
    formula: [
      "a = 8 + 1.1s",
      "x(t) = 50 + a(3 cos t - cos 3t) · 1.95",
      "y(t) = 50 + a(3 sin t - sin 3t) · 1.95",
    ].join("\n"),
    rotate: false,
    particleCount: 78,
    trailSpan: 0.41,
    durationMs: 6200,
    rotationDurationMs: 34000,
    pulseDurationMs: 5400,
    strokeWidth: 4.7,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const a = 8 + detailScale * 1.1;
      const x = a * (3 * Math.cos(t) - Math.cos(3 * t));
      const y = a * (3 * Math.sin(t) - Math.sin(3 * t));
      return {
        x: 50 + x * 1.95,
        y: 50 + y * 1.95,
      };
    },
  },
  {
    name: "Deltoid Drift",
    tag: "Deltoid",
    description: "三尖内摆线更克制，像一枚在慢慢流动的几何徽记。",
    formula: [
      "a = 13.5 + 1.4s",
      "x(t) = 50 + a(2 cos t + cos 2t)",
      "y(t) = 50 + a(2 sin t - sin 2t)",
    ].join("\n"),
    rotate: false,
    particleCount: 66,
    trailSpan: 0.38,
    durationMs: 5400,
    rotationDurationMs: 30000,
    pulseDurationMs: 4600,
    strokeWidth: 4.9,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const a = 13.5 + detailScale * 1.4;
      return {
        x: 50 + a * (2 * Math.cos(t) + Math.cos(2 * t)),
        y: 50 + a * (2 * Math.sin(t) - Math.sin(2 * t)),
      };
    },
  },
  {
    name: "Epitrochoid Halo",
    tag: "Epitrochoid",
    description: "外旋轮迹比普通轮线更华丽，带一点精密仪器的感觉。",
    formula: [
      "x(t) = 50 + ((R+r) cos t - d cos((R+r)t/r)) · 3.55",
      "y(t) = 50 + ((R+r) sin t - d sin((R+r)t/r)) · 3.55",
      "R = 5.2, r = 2.1 + 0.12s, d = 4.3 + 0.9s",
    ].join("\n"),
    rotate: false,
    particleCount: 88,
    trailSpan: 0.44,
    durationMs: 7600,
    rotationDurationMs: 42000,
    pulseDurationMs: 6200,
    strokeWidth: 4.4,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const R = 5.2;
      const r = 2.1 + detailScale * 0.12;
      const d = 4.3 + detailScale * 0.9;
      const x = (R + r) * Math.cos(t) - d * Math.cos(((R + r) / r) * t);
      const y = (R + r) * Math.sin(t) - d * Math.sin(((R + r) / r) * t);
      return {
        x: 50 + x * 3.55,
        y: 50 + y * 3.55,
      };
    },
  },
  {
    name: "Fourier Flow",
    tag: "Fourier Curve",
    description: "几组正弦叠加后会形成一种很像活体信号的流动轨迹。",
    formula: [
      "x(t) = 50 + 17 cos t + 7.5 cos(3t + 0.6m) + 3.2 sin(5t - 0.4)",
      "y(t) = 50 + 15 sin t + 8.2 sin(2t + 0.25) - 4.2 cos(4t - 0.5m)",
      "m = 1 + 0.16s",
    ].join("\n"),
    rotate: false,
    particleCount: 92,
    trailSpan: 0.31,
    durationMs: 8400,
    rotationDurationMs: 44000,
    pulseDurationMs: 6800,
    strokeWidth: 4.2,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const mix = 1 + detailScale * 0.16;
      const x =
        17 * Math.cos(t) +
        7.5 * Math.cos(3 * t + 0.6 * mix) +
        3.2 * Math.sin(5 * t - 0.4);
      const y =
        15 * Math.sin(t) +
        8.2 * Math.sin(2 * t + 0.25) -
        4.2 * Math.cos(4 * t - 0.5 * mix);
      return {
        x: 50 + x,
        y: 50 + y,
      };
    },
  },
];

function normalizeProgress(progress) {
  return ((progress % 1) + 1) % 1;
}

function createCard(config) {
  const article = document.createElement("article");
  article.className = "curve-card";
  article.tabIndex = 0;
  article.setAttribute("role", "button");
  article.setAttribute("aria-label", `查看 ${config.name} 的放大预览与代码`);

  article.innerHTML = `
    <div class="curve-frame"></div>
    <div class="curve-meta">
      <h2 class="curve-title">${config.name}</h2>
      <span class="curve-tag">${config.tag}</span>
    </div>
    <p class="curve-desc">${config.description}</p>
  `;

  const frame = article.querySelector(".curve-frame");
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "curve-svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");

  const group = document.createElementNS(SVG_NS, "g");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", String(config.strokeWidth));
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("opacity", "0.1");

  group.appendChild(path);
  svg.appendChild(group);
  frame.appendChild(svg);

  const particles = Array.from({ length: config.particleCount }, () => {
    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("fill", "currentColor");
    group.appendChild(circle);
    return circle;
  });

  return {
    article,
    config,
    group,
    path,
    particles,
    startTime: performance.now(),
    phaseOffset: Math.random(),
  };
}

function buildPath(config, detailScale, steps = 480) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const point = config.point(index / steps, detailScale);
    return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }).join(" ");
}

function getParticle(config, index, progress, detailScale) {
  const tailOffset = index / (config.particleCount - 1);
  const point = config.point(
    normalizeProgress(progress - tailOffset * config.trailSpan),
    detailScale
  );
  const fade = Math.pow(1 - tailOffset, 0.56);

  return {
    x: point.x,
    y: point.y,
    radius: 0.9 + fade * 2.7,
    opacity: 0.04 + fade * 0.96,
  };
}

function getDetailScale(time, config, phaseOffset) {
  const pulseProgress =
    ((time + phaseOffset * config.pulseDurationMs) % config.pulseDurationMs) /
    config.pulseDurationMs;
  const pulseAngle = pulseProgress * Math.PI * 2;
  return 0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48;
}

function getRotation(time, config, phaseOffset) {
  if (!config.rotate) {
    return 0;
  }

  return -(
    ((time + phaseOffset * config.rotationDurationMs) % config.rotationDurationMs) /
    config.rotationDurationMs
  ) * 360;
}

const instances = curves.map((config) => {
  const instance = createCard(config);
  gallery.appendChild(instance.article);
  return instance;
});

const viewerParticles = Array.from({ length: 120 }, () => {
  const circle = document.createElementNS(SVG_NS, "circle");
  circle.setAttribute("fill", "currentColor");
  viewerGroup.appendChild(circle);
  return circle;
});

let activeInstance = null;

function formatCurveCode(config) {
  const pointSource = config.point.toString().replace(/^point/, "function point");
  return [
    `const curve = {`,
    `  name: "${config.name}",`,
    `  tag: "${config.tag}",`,
    `  rotate: ${config.rotate},`,
    `  particleCount: ${config.particleCount},`,
    `  trailSpan: ${config.trailSpan},`,
    `  durationMs: ${config.durationMs},`,
    `  rotationDurationMs: ${config.rotationDurationMs},`,
    `  pulseDurationMs: ${config.pulseDurationMs},`,
    `  strokeWidth: ${config.strokeWidth},`,
    `};`,
    ``,
    pointSource,
  ].join("\n");
}

function setActiveInstance(instance) {
  activeInstance = instance;
  if (openAnimationFrame) {
    cancelAnimationFrame(openAnimationFrame);
    openAnimationFrame = 0;
  }
  const rect = instance.article.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const modalWidth = Math.min(1200, vw - 32);
  const modalHeight = Math.min(vh - 32, vw <= 640 ? vh - 24 : vh - 32);
  const targetLeft = (vw - modalWidth) / 2;
  const targetTop = (vh - modalHeight) / 2;
  const scaleX = Math.max(0.18, rect.width / modalWidth);
  const scaleY = Math.max(0.18, rect.height / modalHeight);
  viewer.style.setProperty("--viewer-translate-x", `${rect.left - targetLeft}px`);
  viewer.style.setProperty("--viewer-translate-y", `${rect.top - targetTop}px`);
  viewer.style.setProperty("--viewer-scale", `${Math.min(scaleX, scaleY)}`);
  viewerModal.classList.remove("is-open");
  viewerModal.classList.add("is-entering");
  viewerModal.setAttribute("aria-hidden", "false");
  viewerTitle.textContent = instance.config.name;
  viewerTag.textContent = instance.config.tag;
  viewerDesc.textContent = instance.config.description;
  viewerFormula.textContent = instance.config.formula;
  viewerCode.textContent = formatCurveCode(instance.config);
  viewerPath.setAttribute("stroke-width", String(instance.config.strokeWidth));

  instances.forEach((item) => {
    item.article.classList.toggle("is-active", item === instance);
    item.article.setAttribute("aria-pressed", item === instance ? "true" : "false");
  });

  openAnimationFrame = requestAnimationFrame(() => {
    openAnimationFrame = requestAnimationFrame(() => {
      viewerModal.classList.add("is-open");
      viewerModal.classList.remove("is-entering");
      openAnimationFrame = 0;
    });
  });
}

function clearActiveInstance() {
  activeInstance = null;
  if (openAnimationFrame) {
    cancelAnimationFrame(openAnimationFrame);
    openAnimationFrame = 0;
  }
  viewerModal.classList.remove("is-open");
  viewerModal.classList.remove("is-entering");
  viewerModal.setAttribute("aria-hidden", "true");
  instances.forEach((item) => {
    item.article.classList.remove("is-active");
    item.article.setAttribute("aria-pressed", "false");
  });
  viewerTitle.textContent = "";
  viewerTag.textContent = "";
  viewerDesc.textContent = "";
  viewerFormula.textContent = "";
  viewerCode.textContent = "";
  viewerPath.setAttribute("d", "");
}

instances.forEach((instance) => {
  const open = () => setActiveInstance(instance);
  instance.article.addEventListener("click", open);
  instance.article.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
});

viewerClose.addEventListener("click", () => {
  clearActiveInstance();
});

viewerCopy.addEventListener("click", async () => {
  if (!activeInstance) {
    return;
  }

  const textToCopy = [
    `${activeInstance.config.name}`,
    "",
    "Formula",
    activeInstance.config.formula,
    "",
    "Code",
    formatCurveCode(activeInstance.config),
  ].join("\n");

  try {
    await navigator.clipboard.writeText(textToCopy);
    viewerCopy.textContent = "已复制";
    window.setTimeout(() => {
      viewerCopy.textContent = "复制";
    }, 1400);
  } catch (_error) {
    viewerCopy.textContent = "复制失败";
    window.setTimeout(() => {
      viewerCopy.textContent = "复制";
    }, 1400);
  }
});

viewerBackdrop.addEventListener("click", () => {
  clearActiveInstance();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeInstance) {
    clearActiveInstance();
  }
});

function renderInstance(instance, now) {
  const time = now - instance.startTime;
  const { config, group, path, particles, phaseOffset } = instance;
  const progress =
    ((time + phaseOffset * config.durationMs) % config.durationMs) / config.durationMs;
  const detailScale = getDetailScale(time, config, phaseOffset);
  const rotation = getRotation(time, config, phaseOffset);

  group.setAttribute("transform", `rotate(${rotation} 50 50)`);
  path.setAttribute("d", buildPath(config, detailScale));

  particles.forEach((node, index) => {
    const particle = getParticle(config, index, progress, detailScale);
    node.setAttribute("cx", particle.x.toFixed(2));
    node.setAttribute("cy", particle.y.toFixed(2));
    node.setAttribute("r", particle.radius.toFixed(2));
    node.setAttribute("opacity", particle.opacity.toFixed(3));
  });
}

function renderViewer(now) {
  if (!activeInstance) {
    return;
  }

  const time = now - activeInstance.startTime;
  const { config, phaseOffset } = activeInstance;
  const progress =
    ((time + phaseOffset * config.durationMs) % config.durationMs) / config.durationMs;
  const detailScale = getDetailScale(time, config, phaseOffset);
  const rotation = getRotation(time, config, phaseOffset);

  viewerGroup.setAttribute("transform", `rotate(${rotation} 50 50)`);
  viewerPath.setAttribute("d", buildPath(config, detailScale));

  viewerParticles.forEach((node, index) => {
    if (index >= config.particleCount) {
      node.setAttribute("opacity", "0");
      return;
    }

    const particle = getParticle(config, index, progress, detailScale);
    node.setAttribute("cx", particle.x.toFixed(2));
    node.setAttribute("cy", particle.y.toFixed(2));
    node.setAttribute("r", (particle.radius * 1.35).toFixed(2));
    node.setAttribute("opacity", Math.min(1, particle.opacity + 0.04).toFixed(3));
  });
}

function tick(now) {
  instances.forEach((instance) => renderInstance(instance, now));
  renderViewer(now);
  window.requestAnimationFrame(tick);
}

instances.forEach((instance) => renderInstance(instance, performance.now()));
window.requestAnimationFrame(tick);
