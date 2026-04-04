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
const viewerDownload = document.querySelector("#viewer-download");
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
    download: "Download",
    downloaded: "Downloaded",
    downloadFailed: "Failed",
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
    download: "下载",
    downloaded: "已下载",
    downloadFailed: "下载失败",
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
    descriptionEn: "The base circle is carved by a sevenfold cosine term, so the trail blooms into a rotating seven-petal ring.",
    descriptionZh: "基础圆周叠加了 7 倍频余弦项，所以轨迹会长成一个旋转中的七瓣花环。",
    baseRadius: 7,
    detailAmplitude: 3,
    petalCount: 7,
    curveScale: 3.9,
    controls: [
      { key: "baseRadius", labelEn: "Base radius", labelZh: "基础半径", min: 4, max: 10, step: 0.1 },
      { key: "detailAmplitude", labelEn: "Detail", labelZh: "细节振幅", min: 1, max: 5, step: 0.1 },
      { key: "petalCount", labelEn: "Petals", labelZh: "花瓣数", min: 3, max: 12, step: 1 },
      { key: "curveScale", labelEn: "Scale", labelZh: "缩放", min: 2.5, max: 5.5, step: 0.1 },
    ],
    formula(config) {
      return [
        `x(t) = 50 + (${config.baseRadius.toFixed(1)} cos t - ${config.detailAmplitude.toFixed(1)}s cos ${Math.round(config.petalCount)}t) * ${config.curveScale.toFixed(1)}`,
        `y(t) = 50 + (${config.baseRadius.toFixed(1)} sin t - ${config.detailAmplitude.toFixed(1)}s sin ${Math.round(config.petalCount)}t) * ${config.curveScale.toFixed(1)}`,
        "s = detailScale(time)",
      ].join("\n");
    },
    rotate: true,
    particleCount: 64,
    trailSpan: 0.38,
    durationMs: 4600,
    rotationDurationMs: 28000,
    pulseDurationMs: 4200,
    strokeWidth: 5.5,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const petals = Math.round(config.petalCount);
      const x = config.baseRadius * Math.cos(t) - config.detailAmplitude * detailScale * Math.cos(petals * t);
      const y = config.baseRadius * Math.sin(t) - config.detailAmplitude * detailScale * Math.sin(petals * t);
      return {
        x: 50 + x * config.curveScale,
        y: 50 + y * config.curveScale,
      };
    },
  },
  {
    name: "Thinking Five",
    tag: "Custom Rose Trail",
    descriptionEn: "Replacing the sevenfold term with a fivefold term reduces the inner loops, giving the curve a cleaner five-petal rhythm.",
    descriptionZh: "把 7 倍频项换成 5 倍频后，内部环绕圈减少，整条轨迹会呈现更简洁的五瓣节奏。",
    baseRadius: 7,
    detailAmplitude: 3,
    petalCount: 5,
    curveScale: 3.9,
    controls: [
      { key: "baseRadius", labelEn: "Base radius", labelZh: "基础半径", min: 4, max: 10, step: 0.1 },
      { key: "detailAmplitude", labelEn: "Detail", labelZh: "细节振幅", min: 1, max: 5, step: 0.1 },
      { key: "petalCount", labelEn: "Petals", labelZh: "花瓣数", min: 3, max: 12, step: 1 },
      { key: "curveScale", labelEn: "Scale", labelZh: "缩放", min: 2.5, max: 5.5, step: 0.1 },
    ],
    formula(config) {
      return [
        `x(t) = 50 + (${config.baseRadius.toFixed(1)} cos t - ${config.detailAmplitude.toFixed(1)}s cos ${Math.round(config.petalCount)}t) * ${config.curveScale.toFixed(1)}`,
        `y(t) = 50 + (${config.baseRadius.toFixed(1)} sin t - ${config.detailAmplitude.toFixed(1)}s sin ${Math.round(config.petalCount)}t) * ${config.curveScale.toFixed(1)}`,
        "s = detailScale(time)",
      ].join("\n");
    },
    rotate: true,
    particleCount: 62,
    trailSpan: 0.38,
    durationMs: 4600,
    rotationDurationMs: 28000,
    pulseDurationMs: 4200,
    strokeWidth: 5.5,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const petals = Math.round(config.petalCount);
      const x = config.baseRadius * Math.cos(t) - config.detailAmplitude * detailScale * Math.cos(petals * t);
      const y = config.baseRadius * Math.sin(t) - config.detailAmplitude * detailScale * Math.sin(petals * t);
      return {
        x: 50 + x * config.curveScale,
        y: 50 + y * config.curveScale,
      };
    },
  },
  {
    name: "Thinking Nine",
    tag: "Custom Rose Trail",
    descriptionEn: "A ninefold term packs more inner turns into the same orbit, so the floral ring feels denser and more finely braided.",
    descriptionZh: "9 倍频项会把更多小回环压进同一圈轨道里，所以花环会更密、更细。",
    baseRadius: 7,
    detailAmplitude: 3,
    petalCount: 9,
    curveScale: 3.9,
    controls: [
      { key: "baseRadius", labelEn: "Base radius", labelZh: "基础半径", min: 4, max: 10, step: 0.1 },
      { key: "detailAmplitude", labelEn: "Detail", labelZh: "细节振幅", min: 1, max: 5, step: 0.1 },
      { key: "petalCount", labelEn: "Petals", labelZh: "花瓣数", min: 3, max: 12, step: 1 },
      { key: "curveScale", labelEn: "Scale", labelZh: "缩放", min: 2.5, max: 5.5, step: 0.1 },
    ],
    formula(config) {
      return [
        `x(t) = 50 + (${config.baseRadius.toFixed(1)} cos t - ${config.detailAmplitude.toFixed(1)}s cos ${Math.round(config.petalCount)}t) * ${config.curveScale.toFixed(1)}`,
        `y(t) = 50 + (${config.baseRadius.toFixed(1)} sin t - ${config.detailAmplitude.toFixed(1)}s sin ${Math.round(config.petalCount)}t) * ${config.curveScale.toFixed(1)}`,
        "s = detailScale(time)",
      ].join("\n");
    },
    rotate: true,
    particleCount: 68,
    trailSpan: 0.39,
    durationMs: 4700,
    rotationDurationMs: 30000,
    pulseDurationMs: 4200,
    strokeWidth: 5.5,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const petals = Math.round(config.petalCount);
      const x = config.baseRadius * Math.cos(t) - config.detailAmplitude * detailScale * Math.cos(petals * t);
      const y = config.baseRadius * Math.sin(t) - config.detailAmplitude * detailScale * Math.sin(petals * t);
      return {
        x: 50 + x * config.curveScale,
        y: 50 + y * config.curveScale,
      };
    },
  },
  {
    name: "Rose Orbit",
    tag: "r = cos(kθ)",
    descriptionEn: "The radius expands and contracts with cos(7t), so the orbit breathes into repeated petals while staying anchored to a circle.",
    descriptionZh: "半径随 cos(7t) 起伏，所以整条轨迹会在圆周上反复鼓起花瓣，同时保持绕圈感。",
    orbitRadius: 7,
    detailAmplitude: 2.7,
    petalCount: 7,
    curveScale: 3.9,
    controls: [
      { key: "orbitRadius", labelEn: "Base radius", labelZh: "基础半径", min: 4, max: 10, step: 0.1 },
      { key: "detailAmplitude", labelEn: "Detail", labelZh: "细节振幅", min: 1, max: 5, step: 0.1 },
      { key: "petalCount", labelEn: "k", labelZh: "k 值", min: 3, max: 12, step: 1 },
      { key: "curveScale", labelEn: "Scale", labelZh: "缩放", min: 2.5, max: 5.5, step: 0.1 },
    ],
    formula(config) {
      return [
        `r(t) = ${config.orbitRadius.toFixed(1)} - ${config.detailAmplitude.toFixed(1)}s cos(${Math.round(config.petalCount)}t)`,
        `x(t) = 50 + cos t · r(t) · ${config.curveScale.toFixed(1)}`,
        `y(t) = 50 + sin t · r(t) · ${config.curveScale.toFixed(1)}`,
      ].join("\n");
    },
    rotate: true,
    particleCount: 72,
    trailSpan: 0.42,
    durationMs: 5200,
    rotationDurationMs: 28000,
    pulseDurationMs: 4600,
    strokeWidth: 5.2,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const k = Math.round(config.petalCount);
      const r = config.orbitRadius - config.detailAmplitude * detailScale * Math.cos(k * t);
      return {
        x: 50 + Math.cos(t) * r * config.curveScale,
        y: 50 + Math.sin(t) * r * config.curveScale,
      };
    },
  },
  {
    name: "Rose Curve",
    tag: "r = a cos(kθ)",
    descriptionEn: "Using r = a cos(5t) creates five evenly spaced lobes, and the breathing multiplier gently swells each petal in and out.",
    descriptionZh: "使用 r = a cos(5t) 会得到五个均匀分布的花瓣，再叠加呼吸倍率后，每片花瓣都会轻微胀缩。",
    roseA: 9.2,
    roseABoost: 0.6,
    roseBreathBase: 0.72,
    roseBreathBoost: 0.28,
    roseK: 5,
    roseScale: 3.25,
    controls: [
      { key: "roseA", labelEn: "a", labelZh: "a", min: 5, max: 14, step: 0.1 },
      { key: "roseABoost", labelEn: "a boost", labelZh: "a 呼吸量", min: 0, max: 2, step: 0.05 },
      { key: "roseBreathBase", labelEn: "Base pulse", labelZh: "基础呼吸", min: 0.3, max: 1.2, step: 0.01 },
      { key: "roseBreathBoost", labelEn: "Pulse boost", labelZh: "呼吸增量", min: 0, max: 0.8, step: 0.01 },
      { key: "roseK", labelEn: "k", labelZh: "k 值", min: 2, max: 10, step: 1 },
      { key: "roseScale", labelEn: "Scale", labelZh: "缩放", min: 2, max: 5, step: 0.05 },
    ],
    formula(config) {
      return [
        `r(t) = (${config.roseA.toFixed(1)} + ${config.roseABoost.toFixed(2)}s)(${config.roseBreathBase.toFixed(2)} + ${config.roseBreathBoost.toFixed(2)}s) cos(${Math.round(config.roseK)}t)`,
        `x(t) = 50 + cos t · r(t) · ${config.roseScale.toFixed(2)}`,
        `y(t) = 50 + sin t · r(t) · ${config.roseScale.toFixed(2)}`,
      ].join("\n");
    },
    rotate: true,
    particleCount: 78,
    trailSpan: 0.32,
    durationMs: 5400,
    rotationDurationMs: 28000,
    pulseDurationMs: 4600,
    strokeWidth: 4.5,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const a = config.roseA + detailScale * config.roseABoost;
      const k = Math.round(config.roseK);
      const r = a * (config.roseBreathBase + detailScale * config.roseBreathBoost) * Math.cos(k * t);
      return {
        x: 50 + Math.cos(t) * r * config.roseScale,
        y: 50 + Math.sin(t) * r * config.roseScale,
      };
    },
  },
  {
    name: "Rose Two",
    tag: "r = a cos(2θ)",
    descriptionEn: "With k = 2, the cosine radius forms broad opposing petals, and the breathing factor makes the center pulse like the original.",
    descriptionZh: "当 k = 2 时，余弦半径会生成一组宽阔的对称花瓣，呼吸倍率则让中心像原版一样鼓动。",
    roseA: 9.2,
    roseABoost: 0.6,
    roseBreathBase: 0.72,
    roseBreathBoost: 0.28,
    roseScale: 3.25,
    controls: [
      { key: "roseA", labelEn: "a", labelZh: "a", min: 5, max: 14, step: 0.1 },
      { key: "roseABoost", labelEn: "a boost", labelZh: "a 呼吸量", min: 0, max: 2, step: 0.05 },
      { key: "roseBreathBase", labelEn: "Base pulse", labelZh: "基础呼吸", min: 0.3, max: 1.2, step: 0.01 },
      { key: "roseBreathBoost", labelEn: "Pulse boost", labelZh: "呼吸增量", min: 0, max: 0.8, step: 0.01 },
      { key: "roseScale", labelEn: "Scale", labelZh: "缩放", min: 2, max: 5, step: 0.05 },
    ],
    formula(config) {
      return [
        `r(t) = (${config.roseA.toFixed(1)} + ${config.roseABoost.toFixed(2)}s)(${config.roseBreathBase.toFixed(2)} + ${config.roseBreathBoost.toFixed(2)}s) cos(2t)`,
        `x(t) = 50 + cos t · r(t) · ${config.roseScale.toFixed(2)}`,
        `y(t) = 50 + sin t · r(t) · ${config.roseScale.toFixed(2)}`,
      ].join("\n");
    },
    rotate: true,
    particleCount: 74,
    trailSpan: 0.3,
    durationMs: 5200,
    rotationDurationMs: 28000,
    pulseDurationMs: 4300,
    strokeWidth: 4.6,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const a = config.roseA + detailScale * config.roseABoost;
      const r = a * (config.roseBreathBase + detailScale * config.roseBreathBoost) * Math.cos(2 * t);
      return {
        x: 50 + Math.cos(t) * r * config.roseScale,
        y: 50 + Math.sin(t) * r * config.roseScale,
      };
    },
  },
  {
    name: "Rose Three",
    tag: "r = a cos(3θ)",
    descriptionEn: "With k = 3, the curve resolves into three rotating petals, and the inner breathing keeps the motion from feeling mathematically rigid.",
    descriptionZh: "当 k = 3 时，曲线会落成三瓣旋转结构，而内层呼吸感会让它不只是静态的数学图形。",
    roseA: 9.2,
    roseABoost: 0.6,
    roseBreathBase: 0.72,
    roseBreathBoost: 0.28,
    roseScale: 3.25,
    controls: [
      { key: "roseA", labelEn: "a", labelZh: "a", min: 5, max: 14, step: 0.1 },
      { key: "roseABoost", labelEn: "a boost", labelZh: "a 呼吸量", min: 0, max: 2, step: 0.05 },
      { key: "roseBreathBase", labelEn: "Base pulse", labelZh: "基础呼吸", min: 0.3, max: 1.2, step: 0.01 },
      { key: "roseBreathBoost", labelEn: "Pulse boost", labelZh: "呼吸增量", min: 0, max: 0.8, step: 0.01 },
      { key: "roseScale", labelEn: "Scale", labelZh: "缩放", min: 2, max: 5, step: 0.05 },
    ],
    formula(config) {
      return [
        `r(t) = (${config.roseA.toFixed(1)} + ${config.roseABoost.toFixed(2)}s)(${config.roseBreathBase.toFixed(2)} + ${config.roseBreathBoost.toFixed(2)}s) cos(3t)`,
        `x(t) = 50 + cos t · r(t) · ${config.roseScale.toFixed(2)}`,
        `y(t) = 50 + sin t · r(t) · ${config.roseScale.toFixed(2)}`,
      ].join("\n");
    },
    rotate: true,
    particleCount: 76,
    trailSpan: 0.31,
    durationMs: 5300,
    rotationDurationMs: 28000,
    pulseDurationMs: 4400,
    strokeWidth: 4.6,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const a = config.roseA + detailScale * config.roseABoost;
      const r = a * (config.roseBreathBase + detailScale * config.roseBreathBoost) * Math.cos(3 * t);
      return {
        x: 50 + Math.cos(t) * r * config.roseScale,
        y: 50 + Math.sin(t) * r * config.roseScale,
      };
    },
  },
  {
    name: "Rose Four",
    tag: "r = a cos(4θ)",
    descriptionEn: "With k = 4, the petals settle into a balanced cross-like rose, and the breathing core adds the same soft pulse as the original loader.",
    descriptionZh: "当 k = 4 时，花瓣会落成更均衡的十字型玫瑰，而内圆呼吸让它保留原版那种轻微脉动。",
    roseA: 9.2,
    roseABoost: 0.6,
    roseBreathBase: 0.72,
    roseBreathBoost: 0.28,
    roseScale: 3.25,
    controls: [
      { key: "roseA", labelEn: "a", labelZh: "a", min: 5, max: 14, step: 0.1 },
      { key: "roseABoost", labelEn: "a boost", labelZh: "a 呼吸量", min: 0, max: 2, step: 0.05 },
      { key: "roseBreathBase", labelEn: "Base pulse", labelZh: "基础呼吸", min: 0.3, max: 1.2, step: 0.01 },
      { key: "roseBreathBoost", labelEn: "Pulse boost", labelZh: "呼吸增量", min: 0, max: 0.8, step: 0.01 },
      { key: "roseScale", labelEn: "Scale", labelZh: "缩放", min: 2, max: 5, step: 0.05 },
    ],
    formula(config) {
      return [
        `r(t) = (${config.roseA.toFixed(1)} + ${config.roseABoost.toFixed(2)}s)(${config.roseBreathBase.toFixed(2)} + ${config.roseBreathBoost.toFixed(2)}s) cos(4t)`,
        `x(t) = 50 + cos t · r(t) · ${config.roseScale.toFixed(2)}`,
        `y(t) = 50 + sin t · r(t) · ${config.roseScale.toFixed(2)}`,
      ].join("\n");
    },
    rotate: true,
    particleCount: 78,
    trailSpan: 0.32,
    durationMs: 5400,
    rotationDurationMs: 28000,
    pulseDurationMs: 4500,
    strokeWidth: 4.6,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const a = config.roseA + detailScale * config.roseABoost;
      const r = a * (config.roseBreathBase + detailScale * config.roseBreathBoost) * Math.cos(4 * t);
      return {
        x: 50 + Math.cos(t) * r * config.roseScale,
        y: 50 + Math.sin(t) * r * config.roseScale,
      };
    },
  },
  {
    name: "Lissajous Drift",
    tag: "x = sin(at), y = sin(bt)",
    descriptionEn: "Different sine frequencies on x and y make the path cross itself repeatedly, producing the woven feel of an oscilloscope trace.",
    descriptionZh: "x 和 y 使用不同频率的正弦后，路径会不断交叉回绕，所以会呈现示波器一样的编织感。",
    lissajousAmp: 24,
    lissajousAmpBoost: 6,
    lissajousAX: 3,
    lissajousBY: 4,
    lissajousPhase: 1.57,
    lissajousYScale: 0.92,
    controls: [
      { key: "lissajousAmp", labelEn: "Amplitude", labelZh: "振幅", min: 8, max: 36, step: 0.5 },
      { key: "lissajousAmpBoost", labelEn: "Amp pulse", labelZh: "振幅呼吸", min: 0, max: 12, step: 0.1 },
      { key: "lissajousAX", labelEn: "a", labelZh: "a", min: 1, max: 8, step: 1 },
      { key: "lissajousBY", labelEn: "b", labelZh: "b", min: 1, max: 8, step: 1 },
      { key: "lissajousYScale", labelEn: "Y scale", labelZh: "Y 缩放", min: 0.4, max: 1.4, step: 0.01 },
    ],
    formula(config) {
      return [
        `A = ${config.lissajousAmp.toFixed(1)} + ${config.lissajousAmpBoost.toFixed(1)}s`,
        `x(t) = 50 + sin(${Math.round(config.lissajousAX)}t + ${config.lissajousPhase.toFixed(2)}) · A`,
        `y(t) = 50 + sin(${Math.round(config.lissajousBY)}t) · ${config.lissajousYScale.toFixed(2)}A`,
      ].join("\n");
    },
    rotate: false,
    particleCount: 68,
    trailSpan: 0.34,
    durationMs: 6000,
    rotationDurationMs: 36000,
    pulseDurationMs: 5400,
    strokeWidth: 4.7,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const amp = config.lissajousAmp + detailScale * config.lissajousAmpBoost;
      return {
        x: 50 + Math.sin(Math.round(config.lissajousAX) * t + config.lissajousPhase) * amp,
        y: 50 + Math.sin(Math.round(config.lissajousBY) * t) * (amp * config.lissajousYScale),
      };
    },
  },
  {
    name: "Lemniscate Bloom",
    tag: "Bernoulli Lemniscate",
    descriptionEn: "The 1 + sin²t denominator pinches the center while preserving two lobes, so the curve naturally reads as a breathing infinity sign.",
    descriptionZh: "分母里的 1 + sin²t 会把中间收紧、两侧保留双环，因此它天然像一个会呼吸的无限符号。",
    lemniscateA: 20,
    lemniscateBoost: 7,
    controls: [
      { key: "lemniscateA", labelEn: "a", labelZh: "a", min: 8, max: 30, step: 0.5 },
      { key: "lemniscateBoost", labelEn: "Pulse", labelZh: "呼吸量", min: 0, max: 12, step: 0.1 },
    ],
    formula(config) {
      return [
        `a = ${config.lemniscateA.toFixed(1)} + ${config.lemniscateBoost.toFixed(1)}s`,
        "x(t) = 50 + a cos t / (1 + sin² t)",
        "y(t) = 50 + a sin t cos t / (1 + sin² t)",
      ].join("\n");
    },
    rotate: false,
    particleCount: 70,
    trailSpan: 0.4,
    durationMs: 5600,
    rotationDurationMs: 34000,
    pulseDurationMs: 5000,
    strokeWidth: 4.8,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const scale = config.lemniscateA + detailScale * config.lemniscateBoost;
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
    descriptionEn: "The rolling-circle terms create nested turns and offsets, so the path feels like a compact spirograph traced by a machine.",
    descriptionZh: "滚动圆项会叠出嵌套回环和偏移卷曲，因此整条路径会像机械画出来的紧凑内旋轮线。",
    spiroR: 8.2,
    spiror: 2.7,
    spirorBoost: 0.45,
    spirod: 4.8,
    spirodBoost: 1.2,
    spiroScale: 3.05,
    controls: [
      { key: "spiroR", labelEn: "R", labelZh: "R", min: 4, max: 12, step: 0.1 },
      { key: "spiror", labelEn: "r", labelZh: "r", min: 1, max: 5, step: 0.1 },
      { key: "spirod", labelEn: "d", labelZh: "d", min: 1, max: 8, step: 0.1 },
      { key: "spiroScale", labelEn: "Scale", labelZh: "缩放", min: 1.5, max: 4.5, step: 0.05 },
    ],
    formula(config) {
      return [
        `x(t) = 50 + ((R-r) cos t + d cos((R-r)t/r)) · ${config.spiroScale.toFixed(2)}`,
        `y(t) = 50 + ((R-r) sin t - d sin((R-r)t/r)) · ${config.spiroScale.toFixed(2)}`,
        `R = ${config.spiroR.toFixed(1)}, r = ${config.spiror.toFixed(1)} + ${config.spirorBoost.toFixed(2)}s, d = ${config.spirod.toFixed(1)} + ${config.spirodBoost.toFixed(1)}s`,
      ].join("\n");
    },
    rotate: false,
    particleCount: 82,
    trailSpan: 0.46,
    durationMs: 7600,
    rotationDurationMs: 42000,
    pulseDurationMs: 6200,
    strokeWidth: 4.6,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const r = config.spiror + detailScale * config.spirorBoost;
      const d = config.spirod + detailScale * config.spirodBoost;
      const x = (config.spiroR - r) * Math.cos(t) + d * Math.cos(((config.spiroR - r) / r) * t);
      const y = (config.spiroR - r) * Math.sin(t) - d * Math.sin(((config.spiroR - r) / r) * t);
      return {
        x: 50 + x * config.spiroScale,
        y: 50 + y * config.spiroScale,
      };
    },
  },
  {
    name: "Three-Petal Spiral",
    tag: "R = 3, r = 1, d = 3",
    descriptionEn: "This rolling-circle setup resolves into three large looping petals, all breathing together like a compact spiral flower.",
    descriptionZh: "这组滚动圆参数会展开成 3 个大回环，而且整组圆环会像原版一样统一呼吸，像一朵紧凑的三瓣螺旋花。",
    spiralR: 3,
    spiralr: 1,
    spirald: 3,
    spiralScale: 2.2,
    spiralBreath: 0.45,
    controls: [
      { key: "spiralR", labelEn: "R", labelZh: "R", min: 2, max: 8, step: 1 },
      { key: "spiralr", labelEn: "r", labelZh: "r", min: 1, max: 3, step: 0.1 },
      { key: "spirald", labelEn: "d", labelZh: "d", min: 1, max: 5, step: 0.1 },
      { key: "spiralScale", labelEn: "Scale", labelZh: "缩放", min: 1.2, max: 3.5, step: 0.05 },
      { key: "spiralBreath", labelEn: "Pulse", labelZh: "呼吸量", min: 0, max: 1, step: 0.05 },
    ],
    formula(config) {
      return [
        "u(t) = ((R-r) cos t + d cos((R-r)t/r), (R-r) sin t - d sin((R-r)t/r))",
        `m(t) = ${config.spiralScale.toFixed(2)} + ${config.spiralBreath.toFixed(2)}s`,
        "(x, y) = 50 + u(t) · m(t)",
        `R = ${config.spiralR.toFixed(1)}, r = ${config.spiralr.toFixed(1)}, d = ${config.spirald.toFixed(1)}`,
      ].join("\n");
    },
    rotate: true,
    particleCount: 82,
    trailSpan: 0.34,
    durationMs: 4600,
    rotationDurationMs: 28000,
    pulseDurationMs: 4200,
    strokeWidth: 4.4,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const d = config.spirald + detailScale * 0.25;
      const baseX = (config.spiralR - config.spiralr) * Math.cos(t) + d * Math.cos(((config.spiralR - config.spiralr) / config.spiralr) * t);
      const baseY = (config.spiralR - config.spiralr) * Math.sin(t) - d * Math.sin(((config.spiralR - config.spiralr) / config.spiralr) * t);
      const scale = config.spiralScale + detailScale * config.spiralBreath;
      return {
        x: 50 + baseX * scale,
        y: 50 + baseY * scale,
      };
    },
  },
  {
    name: "Four-Petal Spiral",
    tag: "R = 4, r = 1, d = 3",
    descriptionEn: "With R = 4, the rolling-circle path settles into four looping petals, rotating and breathing as one ring.",
    descriptionZh: "当 R = 4 时，滚动圆路径会稳定成 4 个回环花瓣，并且整组会一起旋转、一起呼吸。",
    spiralR: 4,
    spiralr: 1,
    spirald: 3,
    spiralScale: 2.2,
    spiralBreath: 0.45,
    controls: [
      { key: "spiralR", labelEn: "R", labelZh: "R", min: 2, max: 8, step: 1 },
      { key: "spiralr", labelEn: "r", labelZh: "r", min: 1, max: 3, step: 0.1 },
      { key: "spirald", labelEn: "d", labelZh: "d", min: 1, max: 5, step: 0.1 },
      { key: "spiralScale", labelEn: "Scale", labelZh: "缩放", min: 1.2, max: 3.5, step: 0.05 },
      { key: "spiralBreath", labelEn: "Pulse", labelZh: "呼吸量", min: 0, max: 1, step: 0.05 },
    ],
    formula(config) {
      return [
        "u(t) = ((R-r) cos t + d cos((R-r)t/r), (R-r) sin t - d sin((R-r)t/r))",
        `m(t) = ${config.spiralScale.toFixed(2)} + ${config.spiralBreath.toFixed(2)}s`,
        "(x, y) = 50 + u(t) · m(t)",
        `R = ${config.spiralR.toFixed(1)}, r = ${config.spiralr.toFixed(1)}, d = ${config.spirald.toFixed(1)}`,
      ].join("\n");
    },
    rotate: true,
    particleCount: 84,
    trailSpan: 0.34,
    durationMs: 4600,
    rotationDurationMs: 28000,
    pulseDurationMs: 4200,
    strokeWidth: 4.4,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const d = config.spirald + detailScale * 0.25;
      const baseX = (config.spiralR - config.spiralr) * Math.cos(t) + d * Math.cos(((config.spiralR - config.spiralr) / config.spiralr) * t);
      const baseY = (config.spiralR - config.spiralr) * Math.sin(t) - d * Math.sin(((config.spiralR - config.spiralr) / config.spiralr) * t);
      const scale = config.spiralScale + detailScale * config.spiralBreath;
      return {
        x: 50 + baseX * scale,
        y: 50 + baseY * scale,
      };
    },
  },
  {
    name: "Five-Petal Spiral",
    tag: "R = 5, r = 1, d = 3",
    descriptionEn: "With R = 5, the loop count increases to five petals, giving the spiral flower a denser and more ornate rhythm.",
    descriptionZh: "当 R = 5 时，回环数量会变成 5 个花瓣，整朵螺旋花会显得更密、更华丽。",
    spiralR: 5,
    spiralr: 1,
    spirald: 3,
    spiralScale: 2.2,
    spiralBreath: 0.45,
    controls: [
      { key: "spiralR", labelEn: "R", labelZh: "R", min: 2, max: 8, step: 1 },
      { key: "spiralr", labelEn: "r", labelZh: "r", min: 1, max: 3, step: 0.1 },
      { key: "spirald", labelEn: "d", labelZh: "d", min: 1, max: 5, step: 0.1 },
      { key: "spiralScale", labelEn: "Scale", labelZh: "缩放", min: 1.2, max: 3.5, step: 0.05 },
      { key: "spiralBreath", labelEn: "Pulse", labelZh: "呼吸量", min: 0, max: 1, step: 0.05 },
    ],
    formula(config) {
      return [
        "u(t) = ((R-r) cos t + d cos((R-r)t/r), (R-r) sin t - d sin((R-r)t/r))",
        `m(t) = ${config.spiralScale.toFixed(2)} + ${config.spiralBreath.toFixed(2)}s`,
        "(x, y) = 50 + u(t) · m(t)",
        `R = ${config.spiralR.toFixed(1)}, r = ${config.spiralr.toFixed(1)}, d = ${config.spirald.toFixed(1)}`,
      ].join("\n");
    },
    rotate: true,
    particleCount: 85,
    trailSpan: 0.34,
    durationMs: 4600,
    rotationDurationMs: 28000,
    pulseDurationMs: 4200,
    strokeWidth: 4.4,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const d = config.spirald + detailScale * 0.25;
      const baseX = (config.spiralR - config.spiralr) * Math.cos(t) + d * Math.cos(((config.spiralR - config.spiralr) / config.spiralr) * t);
      const baseY = (config.spiralR - config.spiralr) * Math.sin(t) - d * Math.sin(((config.spiralR - config.spiralr) / config.spiralr) * t);
      const scale = config.spiralScale + detailScale * config.spiralBreath;
      return {
        x: 50 + baseX * scale,
        y: 50 + baseY * scale,
      };
    },
  },
  {
    name: "Six-Petal Spiral",
    tag: "R = 6, r = 1, d = 3",
    descriptionEn: "The rolling-circle path splits into six petals, and the whole ring breathes in one unified pulse like the original loader.",
    descriptionZh: "滚动圆路径会展开成六个花瓣，而且整组圆环会像原版一样以统一节奏一起呼吸缩放。",
    spiralR: 6,
    spiralr: 1,
    spirald: 3,
    spiralScale: 2.2,
    spiralBreath: 0.45,
    controls: [
      { key: "spiralR", labelEn: "R", labelZh: "R", min: 2, max: 8, step: 1 },
      { key: "spiralr", labelEn: "r", labelZh: "r", min: 1, max: 3, step: 0.1 },
      { key: "spirald", labelEn: "d", labelZh: "d", min: 1, max: 5, step: 0.1 },
      { key: "spiralScale", labelEn: "Scale", labelZh: "缩放", min: 1.2, max: 3.5, step: 0.05 },
      { key: "spiralBreath", labelEn: "Pulse", labelZh: "呼吸量", min: 0, max: 1, step: 0.05 },
    ],
    formula(config) {
      return [
        "u(t) = ((R-r) cos t + d cos((R-r)t/r), (R-r) sin t - d sin((R-r)t/r))",
        `m(t) = ${config.spiralScale.toFixed(2)} + ${config.spiralBreath.toFixed(2)}s`,
        "(x, y) = 50 + u(t) · m(t)",
        `R = ${config.spiralR.toFixed(1)}, r = ${config.spiralr.toFixed(1)}, d = ${config.spirald.toFixed(1)}`,
      ].join("\n");
    },
    rotate: true,
    particleCount: 86,
    trailSpan: 0.34,
    durationMs: 4600,
    rotationDurationMs: 28000,
    pulseDurationMs: 4200,
    strokeWidth: 4.4,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const d = config.spirald + detailScale * 0.25;
      const baseX = (config.spiralR - config.spiralr) * Math.cos(t) + d * Math.cos(((config.spiralR - config.spiralr) / config.spiralr) * t);
      const baseY = (config.spiralR - config.spiralr) * Math.sin(t) - d * Math.sin(((config.spiralR - config.spiralr) / config.spiralr) * t);
      const scale = config.spiralScale + detailScale * config.spiralBreath;
      return {
        x: 50 + baseX * scale,
        y: 50 + baseY * scale,
      };
    },
  },
  {
    name: "Butterfly Phase",
    tag: "Butterfly Curve",
    descriptionEn: "Exponential and high-frequency cosine terms stretch the wings unevenly, giving the path its unmistakably fluttering butterfly shape.",
    descriptionZh: "指数项和高频余弦会把两侧翅膀不均匀地拉开，所以整条轨迹会像蝴蝶一样拍动。",
    butterflyTurns: 12,
    butterflyScale: 4.6,
    butterflyPulse: 0.45,
    butterflyCosWeight: 2,
    butterflyPower: 5,
    controls: [
      { key: "butterflyTurns", labelEn: "Turns", labelZh: "圈数", min: 6, max: 18, step: 0.5 },
      { key: "butterflyScale", labelEn: "Scale", labelZh: "缩放", min: 2.5, max: 7, step: 0.05 },
      { key: "butterflyPulse", labelEn: "Pulse", labelZh: "呼吸量", min: 0, max: 1.2, step: 0.01 },
      { key: "butterflyCosWeight", labelEn: "Cos weight", labelZh: "余弦权重", min: 0.5, max: 4, step: 0.05 },
      { key: "butterflyPower", labelEn: "Power", labelZh: "幂次", min: 2, max: 8, step: 1 },
    ],
    formula(config) {
      return [
        `u = ${config.butterflyTurns.toFixed(1)}t`,
        `B(u) = e^{cos u} - ${config.butterflyCosWeight.toFixed(2)} cos 4u - sin^${Math.round(config.butterflyPower)}(u/12)`,
        `x(t) = 50 + sin u · B(u) · (${config.butterflyScale.toFixed(2)} + ${config.butterflyPulse.toFixed(2)}s)`,
        `y(t) = 50 + cos u · B(u) · (${config.butterflyScale.toFixed(2)} + ${config.butterflyPulse.toFixed(2)}s)`,
      ].join("\n");
    },
    rotate: false,
    particleCount: 88,
    trailSpan: 0.32,
    durationMs: 9000,
    rotationDurationMs: 50000,
    pulseDurationMs: 7000,
    strokeWidth: 4.4,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * config.butterflyTurns;
      const s =
        Math.exp(Math.cos(t)) -
        config.butterflyCosWeight * Math.cos(4 * t) -
        Math.sin(t / 12) ** Math.round(config.butterflyPower);
      const scale = config.butterflyScale + detailScale * config.butterflyPulse;
      return {
        x: 50 + Math.sin(t) * s * scale,
        y: 50 + Math.cos(t) * s * scale,
      };
    },
  },
  {
    name: "Cardioid Glow",
    tag: "Cardioid",
    descriptionEn: "Because r = a(1 - cos t) collapses to zero at one side and swells on the other, the curve reads like a soft pulsing heart wave.",
    descriptionZh: "由于 r = a(1 - cos t) 会在一侧收成尖点、另一侧鼓起，所以这条曲线会像温和起伏的心形脉冲。",
    cardioidA: 8.4,
    cardioidPulse: 0.8,
    cardioidScale: 2.15,
    controls: [
      { key: "cardioidA", labelEn: "a", labelZh: "a", min: 4, max: 14, step: 0.1 },
      { key: "cardioidPulse", labelEn: "Pulse", labelZh: "呼吸量", min: 0, max: 2, step: 0.05 },
      { key: "cardioidScale", labelEn: "Scale", labelZh: "缩放", min: 1, max: 3.5, step: 0.05 },
    ],
    formula(config) {
      return [
        `a = ${config.cardioidA.toFixed(1)} + ${config.cardioidPulse.toFixed(2)}s`,
        "r(t) = a(1 - cos t)",
        `x(t) = 50 + cos t · r(t) · ${config.cardioidScale.toFixed(2)}`,
        `y(t) = 50 + sin t · r(t) · ${config.cardioidScale.toFixed(2)}`,
      ].join("\n");
    },
    rotate: false,
    particleCount: 72,
    trailSpan: 0.36,
    durationMs: 6200,
    rotationDurationMs: 36000,
    pulseDurationMs: 5200,
    strokeWidth: 4.9,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const a = config.cardioidA + detailScale * config.cardioidPulse;
      const r = a * (1 - Math.cos(t));
      return {
        x: 50 + Math.cos(t) * r * config.cardioidScale,
        y: 50 + Math.sin(t) * r * config.cardioidScale,
      };
    },
  },
  {
    name: "Cardioid Heart",
    tag: "r = a(1 + cosθ)",
    descriptionEn: "Starting from r = a(1 + cos t) and rotating the coordinates turns the textbook cardioid into a more legible upright heart.",
    descriptionZh: "从 r = a(1 + cos t) 出发，再把坐标整体旋转后，标准心形线就会变成更直观的竖向爱心。",
    cardioidA: 8.8,
    cardioidPulse: 0.8,
    cardioidScale: 2.15,
    controls: [
      { key: "cardioidA", labelEn: "a", labelZh: "a", min: 4, max: 14, step: 0.1 },
      { key: "cardioidPulse", labelEn: "Pulse", labelZh: "呼吸量", min: 0, max: 2, step: 0.05 },
      { key: "cardioidScale", labelEn: "Scale", labelZh: "缩放", min: 1, max: 3.5, step: 0.05 },
    ],
    formula(config) {
      return [
        `a = ${config.cardioidA.toFixed(1)} + ${config.cardioidPulse.toFixed(2)}s`,
        "r(t) = a(1 + cos t)",
        "x'(t) = -sin t · r(t)",
        `y'(t) = -cos t · r(t), m = ${config.cardioidScale.toFixed(2)}`,
      ].join("\n");
    },
    rotate: false,
    particleCount: 74,
    trailSpan: 0.36,
    durationMs: 6200,
    rotationDurationMs: 36000,
    pulseDurationMs: 5200,
    strokeWidth: 4.9,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const a = config.cardioidA + detailScale * config.cardioidPulse;
      const r = a * (1 + Math.cos(t));
      const baseX = Math.cos(t) * r;
      const baseY = Math.sin(t) * r;
      return {
        x: 50 - baseY * config.cardioidScale,
        y: 50 - baseX * config.cardioidScale,
      };
    },
  },
  {
    name: "Heart Wave",
    tag: "f(x) Heart Wave",
    descriptionEn: "The x^(2/3) envelope supplies the heart outline, while sin(bπx) fills its interior with adjustable horizontal ripples.",
    descriptionZh: "x^(2/3) 负责给出爱心外轮廓，sin(bπx) 则把可调密度的横向波纹填进心形内部。",
    heartWaveB: 6.4,
    heartWaveRoot: 3.3,
    heartWaveAmp: 0.9,
    heartWaveScaleX: 23.2,
    heartWaveScaleY: 24.5,
    controls: [
      { key: "heartWaveB", labelEn: "b", labelZh: "b", min: 2, max: 12, step: 0.1 },
      { key: "heartWaveRoot", labelEn: "Root span", labelZh: "根号范围", min: 2.2, max: 4.2, step: 0.05 },
      { key: "heartWaveAmp", labelEn: "Wave amp", labelZh: "波纹振幅", min: 0.3, max: 1.6, step: 0.05 },
      { key: "heartWaveScaleX", labelEn: "X scale", labelZh: "X 缩放", min: 14, max: 30, step: 0.1 },
      { key: "heartWaveScaleY", labelEn: "Y scale", labelZh: "Y 缩放", min: 14, max: 34, step: 0.1 },
    ],
    formula(config) {
      return [
        `f(x) = |x|^(2/3) + ${config.heartWaveAmp.toFixed(2)}√(${config.heartWaveRoot.toFixed(2)} - x²) sin(${config.heartWaveB.toFixed(1)}πx)`,
        `screenX = 50 + x · ${config.heartWaveScaleX.toFixed(1)}`,
        `screenY = 18 + (1.75 - f(x))(${config.heartWaveScaleY.toFixed(1)} + 1.5s)`,
      ].join("\n");
    },
    rotate: false,
    particleCount: 104,
    trailSpan: 0.18,
    durationMs: 8400,
    rotationDurationMs: 22000,
    pulseDurationMs: 5600,
    strokeWidth: 3.9,
    point(progress, detailScale, config) {
      const xLimit = Math.sqrt(config.heartWaveRoot);
      const x = -xLimit + progress * xLimit * 2;
      const safeRoot = Math.max(0, config.heartWaveRoot - x * x);
      const b = config.heartWaveB;
      const wave = config.heartWaveAmp * Math.sqrt(safeRoot) * Math.sin(b * Math.PI * x);
      const curve = Math.pow(Math.abs(x), 2 / 3);
      const y = curve + wave;
      const scaleX = config.heartWaveScaleX;
      const scaleY = config.heartWaveScaleY + detailScale * 1.5;

      return {
        x: 50 + x * scaleX,
        y: 18 + (1.75 - y) * scaleY,
      };
    },
  },
  {
    name: "Spiral Search",
    tag: "Archimedean Spiral",
    descriptionEn: "A fast-growing angle combined with a cosine-modulated radius creates a spiral that opens out and closes cleanly back into itself.",
    descriptionZh: "快速增长的角度配合被余弦调制的半径，会形成向外展开又能平顺闭合的螺旋轨迹。",
    searchTurns: 4,
    searchBaseRadius: 8,
    searchRadiusAmp: 8.5,
    searchPulse: 2.4,
    searchScale: 1,
    controls: [
      { key: "searchTurns", labelEn: "Turns", labelZh: "圈数", min: 2, max: 8, step: 0.1 },
      { key: "searchBaseRadius", labelEn: "Base radius", labelZh: "基础半径", min: 2, max: 16, step: 0.1 },
      { key: "searchRadiusAmp", labelEn: "Radius amp", labelZh: "半径振幅", min: 2, max: 16, step: 0.1 },
      { key: "searchPulse", labelEn: "Pulse", labelZh: "呼吸量", min: 0, max: 6, step: 0.1 },
      { key: "searchScale", labelEn: "Scale", labelZh: "缩放", min: 0.5, max: 1.8, step: 0.05 },
    ],
    formula(config) {
      return [
        `θ(t) = ${config.searchTurns.toFixed(1)}t`,
        `r(t) = ${config.searchBaseRadius.toFixed(1)} + (1 - cos t)(${config.searchRadiusAmp.toFixed(1)} + ${config.searchPulse.toFixed(1)}s)`,
        `x(t) = 50 + cos θ · r(t) · ${config.searchScale.toFixed(2)}`,
        `y(t) = 50 + sin θ · r(t) · ${config.searchScale.toFixed(2)}`,
      ].join("\n");
    },
    rotate: false,
    particleCount: 86,
    trailSpan: 0.28,
    durationMs: 7800,
    rotationDurationMs: 44000,
    pulseDurationMs: 6800,
    strokeWidth: 4.3,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const angle = t * config.searchTurns;
      const radius =
        config.searchBaseRadius +
        (1 - Math.cos(t)) * (config.searchRadiusAmp + detailScale * config.searchPulse);
      return {
        x: 50 + Math.cos(angle) * radius * config.searchScale,
        y: 50 + Math.sin(angle) * radius * config.searchScale,
      };
    },
  },
  {
    name: "Fourier Flow",
    tag: "Fourier Curve",
    descriptionEn: "Several sine and cosine components interfere with one another, so the shape keeps mutating like a living waveform.",
    descriptionZh: "多组正弦和余弦彼此干涉后，轮廓会持续变形，看起来像一条有生命的信号波。",
    fourierX1: 17,
    fourierX3: 7.5,
    fourierX5: 3.2,
    fourierY1: 15,
    fourierY2: 8.2,
    fourierY4: 4.2,
    fourierMixBase: 1,
    fourierMixPulse: 0.16,
    controls: [
      { key: "fourierX1", labelEn: "x cos1", labelZh: "x 一阶", min: 4, max: 24, step: 0.1 },
      { key: "fourierX3", labelEn: "x cos3", labelZh: "x 三阶", min: 0, max: 14, step: 0.1 },
      { key: "fourierX5", labelEn: "x sin5", labelZh: "x 五阶", min: 0, max: 10, step: 0.1 },
      { key: "fourierY1", labelEn: "y sin1", labelZh: "y 一阶", min: 4, max: 24, step: 0.1 },
      { key: "fourierY2", labelEn: "y sin2", labelZh: "y 二阶", min: 0, max: 14, step: 0.1 },
      { key: "fourierY4", labelEn: "y cos4", labelZh: "y 四阶", min: 0, max: 10, step: 0.1 },
      { key: "fourierMixPulse", labelEn: "Mix pulse", labelZh: "混合呼吸", min: 0, max: 0.8, step: 0.01 },
    ],
    formula(config) {
      return [
        `x(t) = 50 + ${config.fourierX1.toFixed(1)} cos t + ${config.fourierX3.toFixed(1)} cos(3t + 0.6m) + ${config.fourierX5.toFixed(1)} sin(5t - 0.4)`,
        `y(t) = 50 + ${config.fourierY1.toFixed(1)} sin t + ${config.fourierY2.toFixed(1)} sin(2t + 0.25) - ${config.fourierY4.toFixed(1)} cos(4t - 0.5m)`,
        `m = ${config.fourierMixBase.toFixed(2)} + ${config.fourierMixPulse.toFixed(2)}s`,
      ].join("\n");
    },
    rotate: false,
    particleCount: 92,
    trailSpan: 0.31,
    durationMs: 8400,
    rotationDurationMs: 44000,
    pulseDurationMs: 6800,
    strokeWidth: 4.2,
    point(progress, detailScale, config) {
      const t = progress * Math.PI * 2;
      const mix = config.fourierMixBase + detailScale * config.fourierMixPulse;
      const x =
        config.fourierX1 * Math.cos(t) +
        config.fourierX3 * Math.cos(3 * t + 0.6 * mix) +
        config.fourierX5 * Math.sin(5 * t - 0.4);
      const y =
        config.fourierY1 * Math.sin(t) +
        config.fourierY2 * Math.sin(2 * t + 0.25) -
        config.fourierY4 * Math.cos(4 * t - 0.5 * mix);
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
  viewerDownload.textContent = ui.download;
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

  if (
    key === "trailSpan" ||
    key === "strokeWidth" ||
    !Number.isInteger(value)
  ) {
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

function formatFormula(config) {
  if (typeof config.formula === "function") {
    return config.formula(config);
  }

  return config.formula;
}

function syncViewerMeta(config) {
  viewerFormula.textContent = formatFormula(config);
  viewerCode.textContent = formatCurveCode(config);
  viewerPath.setAttribute("stroke-width", String(config.strokeWidth));
  renderControls(config);
}

function serializeCurveValue(value) {
  return JSON.stringify(value);
}

function formatCurveRuntimeObject(config) {
  const formulaSource =
    typeof config.formula === "function"
      ? config.formula.toString()
      : `formula: () => ${serializeCurveValue(config.formula)}`;
  const pointSource = config.point.toString();
  const orderedKeys = [
    "name",
    "tag",
    "rotate",
    "particleCount",
    "trailSpan",
    "durationMs",
    "rotationDurationMs",
    "pulseDurationMs",
    "strokeWidth",
  ];
  const skipKeys = new Set([
    ...orderedKeys,
    "descriptionEn",
    "descriptionZh",
    "controls",
    "formula",
    "point",
  ]);
  const dynamicKeys = Object.keys(config).filter((key) => !skipKeys.has(key));
  const scalarKeys = [...orderedKeys, ...dynamicKeys].filter((key) => key in config);
  const scalarLines = scalarKeys.map((key) => `  ${key}: ${serializeCurveValue(config[key])},`);

  return [
    `const config = {`,
    ...scalarLines,
    typeof config.formula === "function"
      ? `  ${formulaSource},`
      : `  ${formulaSource},`,
    `  ${pointSource},`,
    `};`,
  ].join("\n");
}

function formatCurveCode(config) {
  const runtimeObject = formatCurveRuntimeObject(config);

  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '  <meta charset="utf-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1" />',
    `  <title>${config.name}</title>`,
    "  <style>",
    "    :root { color-scheme: dark; }",
    "    * { box-sizing: border-box; }",
    "    body {",
    "      margin: 0;",
    "      min-height: 100vh;",
    "      display: grid;",
    "      place-items: center;",
    "      background: #050505;",
    "      color: #f5f5f5;",
    "      font-family: Inter, system-ui, sans-serif;",
    "    }",
    "    .demo {",
    "      display: grid;",
    "      gap: 20px;",
    "      justify-items: center;",
    "      padding: 32px;",
    "    }",
    "    .frame {",
    "      width: min(72vmin, 420px);",
    "      aspect-ratio: 1;",
    "      display: grid;",
    "      place-items: center;",
    "    }",
    "    svg {",
    "      width: 100%;",
    "      height: 100%;",
    "      overflow: visible;",
    "    }",
    "    .meta {",
    "      display: grid;",
    "      gap: 6px;",
    "      text-align: center;",
    "    }",
    "    .title {",
    "      font-size: 22px;",
    "      font-weight: 700;",
    "    }",
    "    .tag {",
    "      font-size: 13px;",
    "      letter-spacing: 0.18em;",
    "      text-transform: uppercase;",
    "      color: rgba(255,255,255,0.58);",
    "    }",
    "    .formula {",
      "      max-width: min(92vw, 720px);",
      "      padding: 14px 16px;",
      "      border: 1px solid rgba(255,255,255,0.1);",
      "      border-radius: 14px;",
      "      background: rgba(255,255,255,0.03);",
      "      color: rgba(255,255,255,0.82);",
      "      font: 13px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace;",
      "      white-space: pre-wrap;",
    "    }",
    "    .back-link {",
    "      display: inline-flex;",
    "      align-items: center;",
    "      justify-content: center;",
    "      padding: 10px 16px;",
    "      border-radius: 999px;",
    "      border: 1px solid rgba(255,255,255,0.14);",
    "      background: rgba(255,255,255,0.04);",
    "      color: #fff;",
    "      text-decoration: none;",
    "      font-size: 13px;",
    "      line-height: 1;",
    "      transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;",
    "    }",
    "    .back-link:hover {",
    "      background: rgba(255,255,255,0.08);",
    "      border-color: rgba(255,255,255,0.22);",
    "      transform: translateY(-1px);",
    "    }",
    "  </style>",
    "</head>",
    "<body>",
    '  <div class="demo">',
    '    <div class="frame">',
    '      <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">',
    '        <g id="group">',
    '          <path id="path" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" opacity="0.1"></path>',
    "        </g>",
    "      </svg>",
    "    </div>",
    '    <div class="meta">',
    `      <div class="title">${config.name}</div>`,
    `      <div class="tag">${config.tag}</div>`,
    "    </div>",
    '    <pre class="formula" id="formula"></pre>',
    '    <a class="back-link" href="https://paidax01.github.io/math-curve-loaders/" target="_blank" rel="noreferrer">View All</a>',
    "  </div>",
    "  <script>",
    "    const SVG_NS = 'http://www.w3.org/2000/svg';",
    `    ${runtimeObject}`,
    "    const group = document.querySelector('#group');",
    "    const path = document.querySelector('#path');",
    "    const formula = document.querySelector('#formula');",
    "    path.setAttribute('stroke-width', String(config.strokeWidth));",
    "    formula.textContent = typeof config.formula === 'function' ? config.formula(config) : config.formula;",
    "    const particles = Array.from({ length: config.particleCount }, () => {",
    "      const circle = document.createElementNS(SVG_NS, 'circle');",
    "      circle.setAttribute('fill', 'currentColor');",
    "      group.appendChild(circle);",
    "      return circle;",
    "    });",
    "    function normalizeProgress(progress) {",
    "      return ((progress % 1) + 1) % 1;",
    "    }",
    "    function getDetailScale(time) {",
    "      const pulseProgress = (time % config.pulseDurationMs) / config.pulseDurationMs;",
    "      const pulseAngle = pulseProgress * Math.PI * 2;",
    "      return 0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48;",
    "    }",
    "    function getRotation(time) {",
    "      if (!config.rotate) return 0;",
    "      return -((time % config.rotationDurationMs) / config.rotationDurationMs) * 360;",
    "    }",
    "    function buildPath(detailScale, steps = 480) {",
    "      return Array.from({ length: steps + 1 }, (_, index) => {",
    "        const point = config.point(index / steps, detailScale, config);",
    "        return `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;",
    "      }).join(' ');",
    "    }",
    "    function getParticle(index, progress, detailScale) {",
    "      const tailOffset = index / (config.particleCount - 1);",
    "      const point = config.point(normalizeProgress(progress - tailOffset * config.trailSpan), detailScale, config);",
    "      const fade = Math.pow(1 - tailOffset, 0.56);",
    "      return {",
    "        x: point.x,",
    "        y: point.y,",
    "        radius: 0.9 + fade * 2.7,",
    "        opacity: 0.04 + fade * 0.96,",
    "      };",
    "    }",
    "    const startedAt = performance.now();",
    "    function render(now) {",
    "      const time = now - startedAt;",
    "      const progress = (time % config.durationMs) / config.durationMs;",
    "      const detailScale = getDetailScale(time);",
    "      group.setAttribute('transform', `rotate(${getRotation(time)} 50 50)`);",
    "      path.setAttribute('d', buildPath(detailScale));",
    "      particles.forEach((node, index) => {",
    "        const particle = getParticle(index, progress, detailScale);",
    "        node.setAttribute('cx', particle.x.toFixed(2));",
    "        node.setAttribute('cy', particle.y.toFixed(2));",
    "        node.setAttribute('r', particle.radius.toFixed(2));",
    "        node.setAttribute('opacity', particle.opacity.toFixed(3));",
    "      });",
    "      requestAnimationFrame(render);",
    "    }",
    "    requestAnimationFrame(render);",
    "  </script>",
    "</body>",
    "</html>",
  ].join("\n");
}

function setActiveInstance(instance) {
  activeInstance = instance;
  document.body.classList.add("modal-open");
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
  document.body.classList.remove("modal-open");
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
    formatFormula(activeViewerConfig),
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

viewerDownload.addEventListener("click", () => {
  if (!activeViewerConfig) {
    return;
  }

  try {
    const html = formatCurveCode(activeViewerConfig);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const slug = activeViewerConfig.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    anchor.href = url;
    anchor.download = `${slug || "curve-demo"}.html`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    viewerDownload.textContent = UI_TEXT[currentLanguage].downloaded;
    window.setTimeout(() => {
      viewerDownload.textContent = UI_TEXT[currentLanguage].download;
    }, 1400);
  } catch (_error) {
    viewerDownload.textContent = UI_TEXT[currentLanguage].downloadFailed;
    window.setTimeout(() => {
      viewerDownload.textContent = UI_TEXT[currentLanguage].download;
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

  viewerFormula.textContent = formatFormula(activeViewerConfig);
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
