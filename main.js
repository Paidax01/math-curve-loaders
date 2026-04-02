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
const viewerControls = document.querySelector("#viewer-controls");
const viewerFormula = document.querySelector("#viewer-formula");
const viewerCode = document.querySelector("#viewer-code code");
const viewerCopy = document.querySelector("#viewer-copy");
const viewerClose = document.querySelector("#viewer-close");
const viewerReset = document.querySelector("#viewer-reset");
const langEnButton = document.querySelector("#lang-en");
const langZhButton = document.querySelector("#lang-zh");
const heroEyebrow = document.querySelector("#hero-eyebrow");
const heroTitle = document.querySelector("#hero-title");
const viewerControlsLabel = document.querySelector("#viewer-controls-label");
const viewerFormulaLabel = document.querySelector("#viewer-formula-label");
const viewerCodeLabel = document.querySelector("#viewer-code-label");
let openAnimationFrame = 0;
let currentLanguage = "en";

const UI_TEXT = {
  en: {
    heroEyebrow: "Mathematical Curve Motion",
    heroTitle: "A Gallery of Mathematical Loading Animations",
    galleryLabel: "Mathematical curve animation gallery",
    controls: "Controls",
    formula: "Formula",
    code: "Code",
    reset: "Reset",
    copy: "Copy",
    copied: "Copied",
    copyFailed: "Failed",
    close: "Close",
    ariaOpen: "Open enlarged preview and code for",
  },
  zh: {
    heroEyebrow: "Mathematical Curve Motion",
    heroTitle: "基于数学曲线的加载动画集",
    galleryLabel: "数学曲线动画画廊",
    controls: "配置项",
    formula: "公式",
    code: "代码",
    reset: "重置",
    copy: "复制",
    copied: "已复制",
    copyFailed: "复制失败",
    close: "关闭",
    ariaOpen: "查看放大预览与代码：",
  },
};

const CONTROL_DEFS = [
  { key: "particleCount", labelEn: "Particles", labelZh: "粒子数", min: 24, max: 140, step: 1 },
  { key: "trailSpan", labelEn: "Trail", labelZh: "尾迹长度", min: 0.12, max: 0.68, step: 0.01 },
  { key: "durationMs", labelEn: "Loop", labelZh: "循环时长", min: 2400, max: 12000, step: 100 },
  { key: "pulseDurationMs", labelEn: "Pulse", labelZh: "呼吸时长", min: 1800, max: 10000, step: 100 },
  { key: "rotationDurationMs", labelEn: "Rotate", labelZh: "旋转时长", min: 6000, max: 60000, step: 500 },
  { key: "strokeWidth", labelEn: "Stroke", labelZh: "轨迹粗细", min: 2.5, max: 7.5, step: 0.1 },
];

const curves = [
  {
    name: "Original Thinking",
    tag: "Custom Rose Trail",
    descriptionEn: "The original petal trail loader, kept as the anchor point for the whole collection.",
    descriptionZh: "你最初那版花瓣粒子轨迹，作为整个画廊的起点保留下来。",
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
    name: "Thinking Five",
    tag: "Custom Rose Trail",
    descriptionEn: "A cleaner five-loop variation of the original, with the same motion language and a lighter silhouette.",
    descriptionZh: "和原版同一种语言，但把内部环绕圆数量减到 5，形态更简洁。",
    formula: [
      "x(t) = 50 + (7 cos t - 3s cos 5t) * 3.9",
      "y(t) = 50 + (7 sin t - 3s sin 5t) * 3.9",
      "s = detailScale(time)",
    ].join("\n"),
    rotate: true,
    particleCount: 62,
    trailSpan: 0.38,
    durationMs: 4600,
    rotationDurationMs: 28000,
    pulseDurationMs: 4200,
    strokeWidth: 5.5,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const x = 7 * Math.cos(t) - 3 * detailScale * Math.cos(5 * t);
      const y = 7 * Math.sin(t) - 3 * detailScale * Math.sin(5 * t);
      return {
        x: 50 + x * 3.9,
        y: 50 + y * 3.9,
      };
    },
  },
  {
    name: "Thinking Nine",
    tag: "Custom Rose Trail",
    descriptionEn: "A denser nine-loop variant that keeps the original rhythm while adding a tighter floral cadence.",
    descriptionZh: "保持原版节奏，把环绕圆数量加到 9，轨迹会更密一些。",
    formula: [
      "x(t) = 50 + (7 cos t - 3s cos 9t) * 3.9",
      "y(t) = 50 + (7 sin t - 3s sin 9t) * 3.9",
      "s = detailScale(time)",
    ].join("\n"),
    rotate: true,
    particleCount: 68,
    trailSpan: 0.39,
    durationMs: 4700,
    rotationDurationMs: 30000,
    pulseDurationMs: 4200,
    strokeWidth: 5.5,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const x = 7 * Math.cos(t) - 3 * detailScale * Math.cos(9 * t);
      const y = 7 * Math.sin(t) - 3 * detailScale * Math.sin(9 * t);
      return {
        x: 50 + x * 3.9,
        y: 50 + y * 3.9,
      };
    },
  },
  {
    name: "Rose Orbit",
    tag: "r = cos(kθ)",
    descriptionEn: "A rose-curve interpretation of the original idea, with a softer orbital bloom and clearer symmetry.",
    descriptionZh: "玫瑰线的花瓣结构，保留了你原来那种旋转中的花感。",
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
    name: "Rose Curve",
    tag: "r = a cos(kθ)",
    descriptionEn: "A canonical five-petal rose curve, closer to the textbook polar form with clear symmetric lobes.",
    descriptionZh: "更接近教材里的标准五瓣玫瑰线，花瓣对称，极坐标轮廓更明确。",
    formula: [
      "r(t) = a(0.72 + 0.28s) cos(5t)",
      "a = 9.2 + 0.6s",
      "x(t) = 50 + cos t · r(t) · 3.25",
      "y(t) = 50 + sin t · r(t) · 3.25",
    ].join("\n"),
    rotate: false,
    particleCount: 78,
    trailSpan: 0.32,
    durationMs: 5400,
    rotationDurationMs: 30000,
    pulseDurationMs: 4600,
    strokeWidth: 4.5,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const a = 9.2 + detailScale * 0.6;
      const r = a * (0.72 + detailScale * 0.28) * Math.cos(5 * t);
      return {
        x: 50 + Math.cos(t) * r * 3.25,
        y: 50 + Math.sin(t) * r * 3.25,
      };
    },
  },
  {
    name: "Rose Two",
    tag: "r = a cos(2θ)",
    descriptionEn: "A two-lobe rose with the same breathing inner-core feel as the original, broad and graphic in silhouette.",
    descriptionZh: "固定为 k = 2 的玫瑰线，保留像原版一样的内圆呼吸感，轮廓更宽、更图形化。",
    formula: [
      "r(t) = a(0.72 + 0.28s) cos(2t)",
      "a = 9.2 + 0.6s",
      "x(t) = 50 + cos t · r(t) · 3.25",
      "y(t) = 50 + sin t · r(t) · 3.25",
    ].join("\n"),
    rotate: false,
    particleCount: 74,
    trailSpan: 0.3,
    durationMs: 5200,
    rotationDurationMs: 28000,
    pulseDurationMs: 4300,
    strokeWidth: 4.6,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const a = 9.2 + detailScale * 0.6;
      const r = a * (0.72 + detailScale * 0.28) * Math.cos(2 * t);
      return {
        x: 50 + Math.cos(t) * r * 3.25,
        y: 50 + Math.sin(t) * r * 3.25,
      };
    },
  },
  {
    name: "Rose Three",
    tag: "r = a cos(3θ)",
    descriptionEn: "A three-lobe rose that keeps the original breathing pulse, with a more pinwheel-like cadence.",
    descriptionZh: "固定为 k = 3 的玫瑰线，延续原版的内圆呼吸感，节奏更像缓慢展开的风车。",
    formula: [
      "r(t) = a(0.72 + 0.28s) cos(3t)",
      "a = 9.2 + 0.6s",
      "x(t) = 50 + cos t · r(t) · 3.25",
      "y(t) = 50 + sin t · r(t) · 3.25",
    ].join("\n"),
    rotate: false,
    particleCount: 76,
    trailSpan: 0.31,
    durationMs: 5300,
    rotationDurationMs: 29000,
    pulseDurationMs: 4400,
    strokeWidth: 4.6,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const a = 9.2 + detailScale * 0.6;
      const r = a * (0.72 + detailScale * 0.28) * Math.cos(3 * t);
      return {
        x: 50 + Math.cos(t) * r * 3.25,
        y: 50 + Math.sin(t) * r * 3.25,
      };
    },
  },
  {
    name: "Rose Four",
    tag: "r = a cos(4θ)",
    descriptionEn: "A four-lobe rose with the same soft breathing core, more balanced and emblem-like than the others.",
    descriptionZh: "固定为 k = 4 的玫瑰线，同样加入原版那种内圆呼吸感，整体更均衡，也更像徽记。",
    formula: [
      "r(t) = a(0.72 + 0.28s) cos(4t)",
      "a = 9.2 + 0.6s",
      "x(t) = 50 + cos t · r(t) · 3.25",
      "y(t) = 50 + sin t · r(t) · 3.25",
    ].join("\n"),
    rotate: false,
    particleCount: 78,
    trailSpan: 0.32,
    durationMs: 5400,
    rotationDurationMs: 30000,
    pulseDurationMs: 4500,
    strokeWidth: 4.6,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const a = 9.2 + detailScale * 0.6;
      const r = a * (0.72 + detailScale * 0.28) * Math.cos(4 * t);
      return {
        x: 50 + Math.cos(t) * r * 3.25,
        y: 50 + Math.sin(t) * r * 3.25,
      };
    },
  },
  {
    name: "Lissajous Drift",
    tag: "x = sin(at), y = sin(bt)",
    descriptionEn: "A more oscilloscope-like trace with elegant crossings and a stronger sense of woven motion.",
    descriptionZh: "更像电子示波器里的轨迹，路径穿插感更强。",
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
    descriptionEn: "A breathing infinity loop with a gentler cadence and a more poised, balanced center.",
    descriptionZh: "双纽线像一个呼吸中的无限符号，节奏更优雅。",
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
    descriptionEn: "An inner spirograph loop that feels more engineered, with tightly wound turns and mechanical precision.",
    descriptionZh: "内旋轮线会生成更复杂的卷曲回环，机械感更明显。",
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
    descriptionEn: "The most organic path in the set, reading almost like wings flexing through the particle trail.",
    descriptionZh: "蝴蝶曲线最有生命感，粒子会像在拍动翅膀。",
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
    descriptionEn: "A cardioid rendered as a soft emotional pulse, collapsing inward before opening back out.",
    descriptionZh: "心形线像向内聚拢再释放的呼吸波，情绪感更强。",
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
    name: "Cardioid Heart",
    tag: "r = a(1 + cosθ)",
    descriptionEn: "A standard cardioid rotated into a clearer upright heart silhouette for a more instantly readable shape.",
    descriptionZh: "把标准 cardioid 旋转成更直观的竖向爱心轮廓，视觉上更接近我们熟悉的心形。",
    formula: [
      "r(t) = a(1 + cos t)",
      "a = 8.8 + 0.8s",
      "x'(t) = -sin t · r(t)",
      "y'(t) = -cos t · r(t)",
    ].join("\n"),
    rotate: false,
    particleCount: 74,
    trailSpan: 0.36,
    durationMs: 6200,
    rotationDurationMs: 36000,
    pulseDurationMs: 5200,
    strokeWidth: 4.9,
    point(progress, detailScale) {
      const t = progress * Math.PI * 2;
      const a = 8.8 + detailScale * 0.8;
      const r = a * (1 + Math.cos(t));
      const baseX = Math.cos(t) * r;
      const baseY = Math.sin(t) * r;
      return {
        x: 50 - baseY * 2.15,
        y: 50 - baseX * 2.15,
      };
    },
  },
  {
    name: "Heart Wave",
    tag: "f(x) Heart Wave",
    descriptionEn: "A heart-shaped wave built from a function plot, where parameter b controls the inner ripple density.",
    descriptionZh: "幂函数、三角函数与椭圆边界组合出的心形波纹，参数 b 控制内部波纹密度。",
    formula: [
      "f(x) = x^(2/3) + 0.9√(3.3 - x²) sin(bπx)",
      "screenY ∝ 1.75 - f(x)",
      "b controls the ripple density inside the heart",
    ].join("\n"),
    rotate: false,
    particleCount: 104,
    trailSpan: 0.18,
    durationMs: 8400,
    rotationDurationMs: 22000,
    pulseDurationMs: 5600,
    strokeWidth: 3.9,
    heartWaveB: 6.4,
    controls: [
      { key: "heartWaveB", labelEn: "b", labelZh: "b", min: 2, max: 12, step: 0.1 },
    ],
    point(progress, detailScale, config) {
      const xLimit = Math.sqrt(3.3);
      const x = -xLimit + progress * xLimit * 2;
      const safeRoot = Math.max(0, 3.3 - x * x);
      const b = config.heartWaveB;
      const wave = 0.9 * Math.sqrt(safeRoot) * Math.sin(b * Math.PI * x);
      const curve = Math.pow(Math.abs(x), 2 / 3);
      const y = curve + wave;
      const scaleX = 23.2;
      const scaleY = 24.5 + detailScale * 1.5;

      return {
        x: 50 + x * scaleX,
        y: 18 + (1.75 - y) * scaleY,
      };
    },
  },
  {
    name: "Spiral Search",
    tag: "Archimedean Spiral",
    descriptionEn: "A closed-loop spiral that still feels exploratory, but no longer snaps or truncates at the seam.",
    descriptionZh: "改成闭环的螺旋感轨迹后，保留搜索扩散感，也不会有被截断的跳变。",
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
    name: "Fourier Flow",
    tag: "Fourier Curve",
    descriptionEn: "Layered sine components combine into a living signal, somewhere between motion graphic and heartbeat.",
    descriptionZh: "几组正弦叠加后会形成一种很像活体信号的流动轨迹。",
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

  article.innerHTML = `
    <div class="curve-frame"></div>
    <div class="curve-meta">
      <h2 class="curve-title">${config.name}</h2>
      <span class="curve-tag">${config.tag}</span>
    </div>
    <p class="curve-desc"></p>
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

function getDescription(config) {
  return currentLanguage === "zh" ? config.descriptionZh : config.descriptionEn;
}

function applyLanguage() {
  const ui = UI_TEXT[currentLanguage];
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  heroEyebrow.textContent = ui.heroEyebrow;
  heroTitle.textContent = ui.heroTitle;
  gallery.setAttribute("aria-label", ui.galleryLabel);
  viewerControlsLabel.textContent = ui.controls;
  viewerFormulaLabel.textContent = ui.formula;
  viewerCodeLabel.textContent = ui.code;
  viewerReset.textContent = ui.reset;
  viewerCopy.textContent = ui.copy;
  viewerClose.textContent = ui.close;
  langEnButton.classList.toggle("is-active", currentLanguage === "en");
  langZhButton.classList.toggle("is-active", currentLanguage === "zh");

  instances.forEach((instance) => {
    const desc = instance.article.querySelector(".curve-desc");
    if (desc) {
      desc.textContent = getDescription(instance.config);
    }
    instance.article.setAttribute(
      "aria-label",
      currentLanguage === "zh"
        ? `${ui.ariaOpen}${instance.config.name}`
        : `${ui.ariaOpen} ${instance.config.name}`
    );
  });

  if (activeInstance) {
    viewerDesc.textContent = getDescription(activeInstance.config);
  }
}

function buildPath(config, detailScale, steps = 480) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const point = config.point(index / steps, detailScale, config);
    return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }).join(" ");
}

function getParticle(config, index, progress, detailScale) {
  const tailOffset = index / (config.particleCount - 1);
  const point = config.point(
    normalizeProgress(progress - tailOffset * config.trailSpan),
    detailScale,
    config
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
let activeViewerConfig = null;

function formatControlValue(key, value) {
  if (key.endsWith("Ms")) {
    return `${(value / 1000).toFixed(1)}s`;
  }

  if (key === "trailSpan" || key === "strokeWidth") {
    return Number(value).toFixed(2);
  }

  return `${Math.round(value)}`;
}

function createViewerConfig(config) {
  return {
    ...config,
    point: config.point,
    formula: config.formula,
  };
}

function renderControls(config) {
  viewerControls.innerHTML = "";

  const controls = [...CONTROL_DEFS, ...(config.controls ?? [])];

  controls.forEach((control) => {
    const wrap = document.createElement("label");
    wrap.className = "viewer-control";
    wrap.innerHTML = `
      <div class="viewer-control-head">
        <span class="viewer-control-label">${currentLanguage === "zh" ? control.labelZh : control.labelEn}</span>
        <span class="viewer-control-value" data-value-key="${control.key}">
          ${formatControlValue(control.key, config[control.key])}
        </span>
      </div>
      <input
        type="range"
        min="${control.min}"
        max="${control.max}"
        step="${control.step}"
        value="${config[control.key]}"
        data-key="${control.key}"
      />
    `;
    viewerControls.appendChild(wrap);
  });
}

function syncViewerMeta(config) {
  viewerFormula.textContent = config.formula;
  viewerCode.textContent = formatCurveCode(config);
  viewerPath.setAttribute("stroke-width", String(config.strokeWidth));
  renderControls(config);
}

function formatCurveCode(config) {
  const pointSource = config.point.toString().replace(/^point/, "function point");
  const controls = config.controls ?? [];
  const customLines = controls.map((control) => `  ${control.key}: ${config[control.key]},`);
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
    ...customLines,
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
  viewerDesc.textContent = getDescription(instance.config);
  activeViewerConfig = createViewerConfig(instance.config);
  syncViewerMeta(activeViewerConfig);

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
  viewerControls.innerHTML = "";
  viewerFormula.textContent = "";
  viewerCode.textContent = "";
  viewerPath.setAttribute("d", "");
  activeViewerConfig = null;
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
  if (!activeInstance || !activeViewerConfig) {
    return;
  }

  const textToCopy = [
    `${activeViewerConfig.name}`,
    "",
    "Formula",
    activeViewerConfig.formula,
    "",
    "Code",
    formatCurveCode(activeViewerConfig),
  ].join("\n");

  try {
    await navigator.clipboard.writeText(textToCopy);
      viewerCopy.textContent = UI_TEXT[currentLanguage].copied;
      window.setTimeout(() => {
      viewerCopy.textContent = UI_TEXT[currentLanguage].copy;
    }, 1400);
  } catch (_error) {
    viewerCopy.textContent = UI_TEXT[currentLanguage].copyFailed;
    window.setTimeout(() => {
      viewerCopy.textContent = UI_TEXT[currentLanguage].copy;
    }, 1400);
  }
});

langEnButton.addEventListener("click", () => {
  currentLanguage = "en";
  applyLanguage();
  if (activeViewerConfig) {
    renderControls(activeViewerConfig);
  }
});

langZhButton.addEventListener("click", () => {
  currentLanguage = "zh";
  applyLanguage();
  if (activeViewerConfig) {
    renderControls(activeViewerConfig);
  }
});

viewerReset.addEventListener("click", () => {
  if (!activeInstance) {
    return;
  }

  activeViewerConfig = createViewerConfig(activeInstance.config);
  syncViewerMeta(activeViewerConfig);
});

viewerControls.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || !activeViewerConfig) {
    return;
  }

  const { key } = target.dataset;
  if (!key) {
    return;
  }

  const nextValue = key === "particleCount"
    ? Math.round(Number(target.value))
    : Number(target.value);

  activeViewerConfig[key] = nextValue;

  const valueEl = viewerControls.querySelector(`[data-value-key="${key}"]`);
  if (valueEl) {
    valueEl.textContent = formatControlValue(key, nextValue);
  }

  viewerCode.textContent = formatCurveCode(activeViewerConfig);
  viewerPath.setAttribute("stroke-width", String(activeViewerConfig.strokeWidth));
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
  const { phaseOffset } = activeInstance;
  const config = activeViewerConfig ?? activeInstance.config;
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
applyLanguage();
window.requestAnimationFrame(tick);
