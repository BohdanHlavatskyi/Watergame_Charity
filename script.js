const sceneStack = document.getElementById('sceneStack');
const bubbleLayer = document.getElementById('bubbleLayer');
const scoreValue = document.getElementById('scoreValue');
const dropValue = document.getElementById('dropValue');
const levelValue = document.getElementById('levelValue');
const statusText = document.getElementById('statusText');
const routeProgress = document.getElementById('routeProgress');
const resetBtn = document.getElementById('resetBtn');
const victoryOverlay = document.getElementById('victoryOverlay');
const victoryCopy = document.getElementById('victoryCopy');
const playAgainBtn = document.getElementById('playAgainBtn');
const gameStage = document.getElementById('gameStage');

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 700;
const START_THRESHOLD = 44;
const END_THRESHOLD = 56;
const CORRIDOR_THRESHOLD = 42;
const FAILURE_LIMIT = 3;

const carVariants = [
  { id: 'sedan', color: '#ff7b59', accent: '#c93d3a', glass: '#8fc7ea' },
  { id: 'coupe', color: '#4f8cff', accent: '#2348b2', glass: '#9ed9f7' },
  { id: 'suv', color: '#f1b24a', accent: '#a65f1d', glass: '#8ecbf2' },
  { id: 'pickup', color: '#3fcf7a', accent: '#117d49', glass: '#9fdcf4' },
];

const shipVariants = [
  { id: 'cargo', color: '#d8e4ef', accent: '#6c7f8f', glass: '#4b5a69' },
  { id: 'tanker', color: '#f4f7fb', accent: '#7d94aa', glass: '#465766' },
  { id: 'yacht', color: '#ffdf8c', accent: '#a95a1f', glass: '#8cc8ef' },
  { id: 'ferry', color: '#6bc3ff', accent: '#296eb0', glass: '#d7eefc' },
];

const scenes = [
  {
    id: 'lagoon',
    name: 'Lagoon Preserve',
    hint: 'Trace the safe channel along the inland shore, then clear the floating cans.',
    sky: ['#9fe8ff', '#5ebdf0', '#1b4b7d'],
    water: '#1198d0',
    waterDeep: '#085984',
    land: '#b7d3b5',
    landDeep: '#6f9a72',
    sun: { x: 822, y: 132, r: 38 },
    clouds: [
      { x: 140, y: 120, w: 120, h: 40 },
      { x: 640, y: 98, w: 150, h: 52 },
    ],
    waterPath: 'M0 336 C102 272, 188 252, 284 276 C366 296, 428 340, 528 350 C657 363, 764 303, 874 319 C931 327, 966 350, 1000 372 L1000 700 L0 700 Z',
    shorePath: 'M0 304 C108 252, 182 236, 286 253 C375 268, 428 309, 534 319 C651 331, 755 279, 864 294 C920 301, 964 323, 1000 344',
    roadPath: 'M0 180 C110 154, 220 144, 326 150 C430 156, 526 180, 632 188 C736 196, 830 184, 932 164 C967 156, 984 152, 1000 148',
    roadTrack: [
      [0, 180],
      [110, 154],
      [220, 144],
      [326, 150],
      [430, 156],
      [526, 180],
      [632, 188],
      [736, 196],
      [830, 184],
      [932, 164],
      [1000, 148],
    ],
    decorPath: 'M0 250 C110 228, 180 210, 286 224 C380 238, 460 287, 549 294 C677 305, 765 259, 866 272 C926 279, 968 299, 1000 314 L1000 0 L0 0 Z',
    track: [
      [20, 244],
      [132, 218],
      [244, 206],
      [356, 210],
      [468, 224],
      [580, 240],
      [692, 236],
      [804, 244],
      [916, 258],
      [980, 272],
    ],
    collectibles: [
      { x: 18, y: 60 },
      { x: 26, y: 55 },
      { x: 54, y: 45 },
      { x: 74, y: 64 },
    ],
    hazard: { x: 82, y: 40 },
    baseReward: 8,
  },
  {
    id: 'delta',
    name: 'Forest Delta',
    hint: 'Guide the blue line along the reed-lined shore and keep the spill away from the bank.',
    sky: ['#b7f0ff', '#73c6ff', '#204d87'],
    water: '#0fa4d9',
    waterDeep: '#0d5b8b',
    land: '#97bc84',
    landDeep: '#527956',
    sun: { x: 178, y: 130, r: 34 },
    clouds: [
      { x: 720, y: 116, w: 144, h: 44 },
      { x: 328, y: 92, w: 116, h: 36 },
    ],
    waterPath: 'M0 424 C76 377, 158 343, 252 334 C347 324, 420 352, 494 377 C584 407, 671 422, 770 410 C867 398, 935 363, 1000 320 L1000 700 L0 700 Z',
    shorePath: 'M0 387 C83 343, 161 312, 252 304 C345 296, 423 322, 496 347 C588 378, 675 392, 772 381 C866 370, 933 339, 1000 299',
    roadPath: 'M0 198 C96 174, 198 166, 300 176 C396 186, 512 214, 614 214 C720 214, 812 190, 912 180 C948 176, 980 172, 1000 168',
    roadTrack: [
      [0, 198],
      [96, 174],
      [198, 166],
      [300, 176],
      [396, 186],
      [512, 214],
      [614, 214],
      [720, 214],
      [812, 190],
      [912, 180],
      [1000, 168],
    ],
    decorPath: 'M0 240 C96 258, 188 224, 272 209 C361 193, 446 206, 529 222 C641 246, 744 226, 844 206 C914 191, 965 186, 1000 192 L1000 0 L0 0 Z',
    track: [
      [22, 280],
      [134, 256],
      [246, 238],
      [358, 226],
      [470, 220],
      [582, 228],
      [694, 244],
      [806, 262],
      [918, 280],
      [978, 296],
    ],
    collectibles: [
      { x: 21, y: 70 },
      { x: 37, y: 59 },
      { x: 63, y: 51 },
      { x: 79, y: 69 },
    ],
    hazard: { x: 72, y: 50 },
    baseReward: 10,
  },
  {
    id: 'bay',
    name: 'Sunset Bay',
    hint: 'Close the final safety line before the coast meets the open tide.',
    sky: ['#ffcda8', '#8ea2ff', '#14315f'],
    water: '#1b8ecd',
    waterDeep: '#0a4e7b',
    land: '#d8bf8e',
    landDeep: '#a47e48',
    sun: { x: 770, y: 156, r: 46 },
    clouds: [
      { x: 204, y: 112, w: 120, h: 40 },
      { x: 512, y: 96, w: 146, h: 42 },
    ],
    waterPath: 'M0 326 C84 290, 152 270, 227 280 C294 289, 343 322, 406 358 C479 400, 560 434, 649 439 C750 444, 846 415, 932 382 C968 367, 989 354, 1000 347 L1000 700 L0 700 Z',
    shorePath: 'M0 292 C84 258, 155 241, 230 249 C301 257, 347 289, 411 325 C486 368, 561 399, 649 405 C752 412, 846 385, 936 353 C971 340, 990 329, 1000 321',
    roadPath: 'M0 186 C102 162, 208 154, 310 164 C412 174, 514 198, 620 202 C728 206, 822 188, 922 172 C956 164, 984 158, 1000 156',
    roadTrack: [
      [0, 186],
      [102, 162],
      [208, 154],
      [310, 164],
      [412, 174],
      [514, 198],
      [620, 202],
      [728, 206],
      [822, 188],
      [922, 172],
      [1000, 156],
    ],
    decorPath: 'M0 248 C90 222, 180 217, 263 225 C354 234, 437 214, 512 185 C619 144, 735 131, 845 158 C920 176, 970 196, 1000 210 L1000 0 L0 0 Z',
    track: [
      [18, 232],
      [130, 214],
      [242, 202],
      [354, 198],
      [466, 208],
      [578, 224],
      [690, 240],
      [802, 254],
      [914, 268],
      [982, 282],
    ],
    collectibles: [
      { x: 16, y: 61 },
      { x: 30, y: 54 },
      { x: 58, y: 46 },
      { x: 82, y: 58 },
    ],
    hazard: { x: 64, y: 63 },
    baseReward: 14,
  },
  {
    id: 'marsh',
    name: 'Reed Marsh',
    hint: 'Follow the quiet shore path above the marsh edge and keep the barrier clear of the wetland.',
    sky: ['#c8f4ff', '#7ed6f4', '#2b5f8a'],
    water: '#18a2d4',
    waterDeep: '#0f5c82',
    land: '#9dc58d',
    landDeep: '#5d8564',
    sun: { x: 210, y: 152, r: 36 },
    clouds: [
      { x: 738, y: 118, w: 124, h: 40 },
      { x: 370, y: 92, w: 104, h: 32 },
    ],
    waterPath: 'M0 368 C92 328, 172 296, 256 308 C336 319, 404 360, 484 372 C576 387, 668 382, 760 354 C835 332, 916 315, 1000 332 L1000 700 L0 700 Z',
    shorePath: 'M0 332 C92 294, 173 268, 257 280 C339 292, 407 332, 486 344 C578 359, 668 354, 760 326 C835 304, 917 286, 1000 304',
    roadPath: 'M0 174 C104 152, 214 144, 320 152 C432 160, 544 182, 646 188 C748 194, 838 182, 938 168 C970 162, 990 158, 1000 154',
    roadTrack: [
      [0, 174],
      [104, 152],
      [214, 144],
      [320, 152],
      [432, 160],
      [544, 182],
      [646, 188],
      [748, 194],
      [838, 182],
      [938, 168],
      [1000, 154],
    ],
    decorPath: 'M0 226 C96 244, 186 214, 276 198 C372 181, 457 196, 542 218 C640 242, 746 226, 846 196 C914 178, 970 174, 1000 180 L1000 0 L0 0 Z',
    track: [
      [20, 250],
      [132, 226],
      [244, 212],
      [356, 204],
      [468, 208],
      [580, 222],
      [692, 238],
      [804, 252],
      [916, 268],
      [980, 278],
    ],
    collectibles: [
      { x: 20, y: 62 },
      { x: 34, y: 54 },
      { x: 58, y: 50 },
      { x: 80, y: 64 },
    ],
    hazard: { x: 68, y: 44 },
    baseReward: 12,
  },
  {
    id: 'cove',
    name: 'Cedar Cove',
    hint: 'Trace the shoreward barrier above the quiet cove and complete the last protective loop.',
    sky: ['#ffd7b3', '#8fb3ff', '#193b67'],
    water: '#1f93d8',
    waterDeep: '#0b517f',
    land: '#d4c08a',
    landDeep: '#9a7349',
    sun: { x: 788, y: 166, r: 42 },
    clouds: [
      { x: 214, y: 114, w: 124, h: 38 },
      { x: 520, y: 100, w: 148, h: 40 },
    ],
    waterPath: 'M0 342 C84 306, 160 284, 240 292 C316 300, 384 338, 458 352 C539 368, 620 368, 706 346 C782 326, 858 308, 1000 320 L1000 700 L0 700 Z',
    shorePath: 'M0 308 C90 274, 166 250, 240 260 C318 270, 386 306, 460 320 C542 336, 621 336, 706 314 C782 294, 862 276, 1000 288',
    roadPath: 'M0 176 C108 156, 220 150, 332 158 C444 166, 568 190, 682 196 C768 200, 856 186, 938 170 C970 164, 988 160, 1000 156',
    roadTrack: [
      [0, 176],
      [108, 156],
      [220, 150],
      [332, 158],
      [444, 166],
      [568, 190],
      [682, 196],
      [768, 200],
      [856, 186],
      [938, 170],
      [1000, 156],
    ],
    decorPath: 'M0 236 C94 208, 176 200, 258 208 C346 217, 430 198, 510 174 C621 144, 740 136, 850 164 C920 182, 970 198, 1000 210 L1000 0 L0 0 Z',
    track: [
      [20, 246],
      [132, 222],
      [244, 210],
      [356, 204],
      [468, 210],
      [580, 224],
      [692, 240],
      [804, 256],
      [916, 270],
      [980, 280],
    ],
    collectibles: [
      { x: 18, y: 58 },
      { x: 32, y: 52 },
      { x: 56, y: 46 },
      { x: 80, y: 60 },
    ],
    hazard: { x: 64, y: 58 },
    baseReward: 16,
  },
];

const state = {
  score: 0,
  drops: 0,
  activeSceneIndex: 0,
  drawing: false,
  pointerId: null,
  currentStrokePoints: [],
  currentStrokeDistance: 0,
  currentStrokeError: 0,
  currentStrokeMaxProgress: 0,
  activeSceneElement: null,
  activeLinePath: null,
  completed: false,
  confettiTimer: null,
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pointToSegmentProjection(point, start, end) {
  const vx = end.x - start.x;
  const vy = end.y - start.y;
  const lengthSquared = vx * vx + vy * vy || 1;
  const t = clamp(((point.x - start.x) * vx + (point.y - start.y) * vy) / lengthSquared, 0, 1);
  const projection = { x: start.x + vx * t, y: start.y + vy * t };
  return { projection, t };
}

function getTrackMetrics(track) {
  const segments = [];
  let totalLength = 0;

  for (let index = 0; index < track.length - 1; index += 1) {
    const start = { x: track[index][0], y: track[index][1] };
    const end = { x: track[index + 1][0], y: track[index + 1][1] };
    const length = distance(start, end);
    segments.push({ start, end, length, startDistance: totalLength });
    totalLength += length;
  }

  return { segments, totalLength };
}

function projectToTrack(point, metrics) {
  let best = { distance: Number.POSITIVE_INFINITY, progress: 0 };

  for (const segment of metrics.segments) {
    const { projection, t } = pointToSegmentProjection(point, segment.start, segment.end);
    const currentDistance = distance(point, projection);
    if (currentDistance < best.distance) {
      best = {
        distance: currentDistance,
        progress: segment.startDistance + segment.length * t,
      };
    }
  }

  return best;
}

function pointsToPath(points) {
  if (!points.length) {
    return '';
  }

  const [first, ...rest] = points;
  let path = `M ${first[0]} ${first[1]}`;
  for (const point of rest) {
    path += ` L ${point[0]} ${point[1]}`;
  }
  return path;
}

function formatScore(value) {
  return Math.max(0, Math.round(value));
}

function getCollectiblePositions(scene) {
  const anchors = [1, 3, 5, 7];
  return anchors
    .filter((index) => index < scene.track.length)
    .map((index) => {
      const [x, y] = scene.track[index];
      return {
        x: (x / VIEWBOX_WIDTH) * 100,
        y: (y / VIEWBOX_HEIGHT) * 100,
      };
    });
}

function showBubble(message, x, y, kind = 'gain') {
  const bubble = document.createElement('div');
  bubble.className = `float-label float-label--${kind}`;
  bubble.textContent = message;
  bubble.style.left = `${x}px`;
  bubble.style.top = `${y}px`;
  bubbleLayer.appendChild(bubble);
  window.setTimeout(() => bubble.remove(), 1200);
}

function pulseStatus(message) {
  statusText.textContent = message;
}

function updateHUD() {
  scoreValue.textContent = formatScore(state.score);
  dropValue.textContent = formatScore(state.drops);
  levelValue.textContent = `${Math.min(state.activeSceneIndex + 1, scenes.length)} / ${scenes.length}`;
}

function updateProgress(progressRatio) {
  routeProgress.style.width = `${clamp(progressRatio * 100, 0, 100)}%`;
}

function award(points, drops = 0, x = 0, y = 0, message = '') {
  state.score += points;
  state.drops += drops;
  updateHUD();
  if (message) {
    showBubble(message, x, y, points >= 0 ? 'gain' : 'loss');
  }
}

function createSvgNode(tagName, attributes = {}) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tagName);
  for (const [attribute, value] of Object.entries(attributes)) {
    node.setAttribute(attribute, String(value));
  }
  return node;
}

function getRoadPoint(roadTrack, progress, laneOffset = 0) {
  if (!roadTrack || roadTrack.length < 2) {
    return { x: 0, y: 0, angle: 0 };
  }

  const clampedProgress = clamp(progress, 0, 1);
  let totalLength = 0;
  const segments = [];

  for (let index = 0; index < roadTrack.length - 1; index += 1) {
    const startPoint = { x: roadTrack[index][0], y: roadTrack[index][1] };
    const endPoint = { x: roadTrack[index + 1][0], y: roadTrack[index + 1][1] };
    const segmentLength = distance(startPoint, endPoint);
    segments.push({ startPoint, endPoint, segmentLength, startDistance: totalLength });
    totalLength += segmentLength;
  }

  const targetDistance = clampedProgress * totalLength;
  let segment = segments[0];
  let segmentProgress = 0;

  for (const currentSegment of segments) {
    if (targetDistance <= currentSegment.startDistance + currentSegment.segmentLength) {
      segment = currentSegment;
      segmentProgress = (targetDistance - currentSegment.startDistance) / currentSegment.segmentLength;
      break;
    }
  }

  const startPoint = segment.startPoint;
  const endPoint = segment.endPoint;
  const x = startPoint.x + (endPoint.x - startPoint.x) * segmentProgress;
  const y = startPoint.y + (endPoint.y - startPoint.y) * segmentProgress;
  const tangentX = endPoint.x - startPoint.x;
  const tangentY = endPoint.y - startPoint.y;
  const magnitude = Math.hypot(tangentX, tangentY) || 1;
  const normalX = -tangentY / magnitude;
  const normalY = tangentX / magnitude;

  return {
    x: x + normalX * laneOffset,
    y: y + normalY * laneOffset,
    angle: Math.atan2(tangentY, tangentX) * (180 / Math.PI),
  };
}

function getWaterPoint(progress, baseY, amplitude, direction) {
  const normalized = clamp(progress, 0, 1);
  const xPercent = normalized * 100;
  const yPercent = baseY + Math.sin(normalized * Math.PI * 2) * amplitude;
  const angle = Math.sin(normalized * Math.PI * 2) * 6 * (direction > 0 ? 1 : -1);
  return { xPercent, yPercent, angle };
}

function createTrafficElement(scene, type, direction = 1, laneIndex = 0) {
  const variants = type === 'car' ? carVariants : shipVariants;
  const variant = variants[Math.floor(Math.random() * variants.length)];
  const element = document.createElement('div');
  element.className = `traffic traffic--${type} traffic--${type}--${variant.id}`;
  element.setAttribute('aria-hidden', 'true');
  element.style.setProperty('--traffic-color', variant.color);
  element.style.setProperty('--traffic-accent', variant.accent);
  element.style.setProperty('--traffic-glass', variant.glass);

  if (type === 'car') {
    element.innerHTML = `
      <div class="traffic__body">
        <span class="traffic__hood"></span>
        <span class="traffic__trunk"></span>
        <span class="traffic__glass traffic__glass--front"></span>
        <span class="traffic__glass traffic__glass--rear"></span>
      </div>
      <span class="traffic__wheel traffic__wheel--front"></span>
      <span class="traffic__wheel traffic__wheel--rear"></span>
    `;
    const laneOffset = (direction > 0 ? -1 : 1) * (7 + laneIndex * 5);
    element.trafficState = {
      roadTrack: scene.roadTrack,
      progress: direction > 0 ? laneIndex * 0.12 : 1 - laneIndex * 0.14,
      direction,
      speed: 0.07 + Math.random() * 0.02 + laneIndex * 0.004,
      laneOffset,
    };
    element.style.left = '0%';
    element.style.top = '0%';
  } else {
    element.innerHTML = `
      <div class="traffic__hull">
        <span class="traffic__deck"></span>
        <span class="traffic__bridge"></span>
        <span class="traffic__mast"></span>
        <span class="traffic__sail"></span>
      </div>
      <span class="traffic__wake"></span>
    `;
    const baseY = 54 + Math.random() * 10;
    element.trafficState = {
      progress: direction > 0 ? 0 : 1,
      direction,
      speed: 0.045 + Math.random() * 0.015,
      baseY,
      amplitude: 1.4 + Math.random() * 1.6,
    };
    element.style.left = '0%';
    element.style.top = '0%';
  }

  return element;
}

function createSceneCard(scene, index) {
  const metrics = getTrackMetrics(scene.track);
  const card = document.createElement('article');
  card.className = 'scene-card';
  card.dataset.sceneIndex = String(index);
  card.dataset.sceneId = scene.id;
  card.innerHTML = `
    <div class="scene-card__title">
      <h2>${scene.name}</h2>
      <p>${scene.hint}</p>
    </div>
    <svg class="scene-card__frame" viewBox="0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}" preserveAspectRatio="none" aria-hidden="true"></svg>
    <svg class="scene-card__scene" viewBox="0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}" preserveAspectRatio="none" aria-hidden="true"></svg>
    <svg class="scene-card__overlay" viewBox="0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}" preserveAspectRatio="none" aria-hidden="true">
      <path class="route-layer route-guide" d="${pointsToPath(scene.track)}"></path>
      <circle class="route-start" cx="${scene.track[0][0]}" cy="${scene.track[0][1]}" r="12" fill="#8df0ff"></circle>
      <circle class="route-end" cx="${scene.track[scene.track.length - 1][0]}" cy="${scene.track[scene.track.length - 1][1]}" r="12" fill="#58f0bc"></circle>
      <path class="route-layer player-line" data-player-line d=""></path>
    </svg>
    <div class="collectibles"></div>
    <div class="hazards"></div>
  `;

  const frame = card.querySelector('.scene-card__frame');
  const sceneSvg = card.querySelector('.scene-card__scene');
  const playerLine = card.querySelector('[data-player-line]');
  const collectiblesLayer = card.querySelector('.collectibles');
  const hazardsLayer = card.querySelector('.hazards');

  const defs = createSvgNode('defs');
  const skyGradient = createSvgNode('linearGradient', {
    id: `sky-${scene.id}`,
    x1: '0%',
    y1: '0%',
    x2: '0%',
    y2: '100%',
  });

  scene.sky.forEach((stopColor, stopIndex) => {
    skyGradient.appendChild(createSvgNode('stop', {
      offset: `${(stopIndex / (scene.sky.length - 1)) * 100}%`,
      'stop-color': stopColor,
    }));
  });

  const waterGradient = createSvgNode('linearGradient', {
    id: `water-${scene.id}`,
    x1: '0%',
    y1: '0%',
    x2: '100%',
    y2: '100%',
  });
  waterGradient.appendChild(createSvgNode('stop', { offset: '0%', 'stop-color': scene.water }));
  waterGradient.appendChild(createSvgNode('stop', { offset: '100%', 'stop-color': scene.waterDeep }));

  const landGradient = createSvgNode('linearGradient', {
    id: `land-${scene.id}`,
    x1: '0%',
    y1: '0%',
    x2: '100%',
    y2: '100%',
  });
  landGradient.appendChild(createSvgNode('stop', { offset: '0%', 'stop-color': scene.land }));
  landGradient.appendChild(createSvgNode('stop', { offset: '100%', 'stop-color': scene.landDeep }));

  defs.append(skyGradient, waterGradient, landGradient);
  sceneSvg.appendChild(defs);

  sceneSvg.appendChild(createSvgNode('rect', {
    x: 0,
    y: 0,
    width: VIEWBOX_WIDTH,
    height: VIEWBOX_HEIGHT,
    fill: `url(#sky-${scene.id})`,
  }));

  scene.clouds.forEach((cloud, cloudIndex) => {
    const cloudGroup = createSvgNode('g', {
      transform: `translate(${cloud.x} ${cloud.y})`,
      opacity: String(0.62 - cloudIndex * 0.08),
    });
    cloudGroup.appendChild(createSvgNode('ellipse', { cx: 0, cy: 0, rx: cloud.w * 0.26, ry: cloud.h * 0.42, fill: 'rgba(255,255,255,0.94)' }));
    cloudGroup.appendChild(createSvgNode('ellipse', { cx: cloud.w * 0.18, cy: -6, rx: cloud.w * 0.21, ry: cloud.h * 0.34, fill: 'rgba(255,255,255,0.9)' }));
    cloudGroup.appendChild(createSvgNode('ellipse', { cx: -cloud.w * 0.18, cy: 6, rx: cloud.w * 0.2, ry: cloud.h * 0.3, fill: 'rgba(255,255,255,0.82)' }));
    sceneSvg.appendChild(cloudGroup);
  });

  sceneSvg.appendChild(createSvgNode('circle', {
    cx: scene.sun.x,
    cy: scene.sun.y,
    r: scene.sun.r,
    fill: 'rgba(255, 229, 159, 0.95)',
    opacity: 0.96,
  }));

  sceneSvg.appendChild(createSvgNode('path', {
    d: scene.decorPath,
    fill: `url(#land-${scene.id})`,
    opacity: '0.96',
  }));

  sceneSvg.appendChild(createSvgNode('path', {
    d: scene.waterPath,
    fill: `url(#water-${scene.id})`,
  }));

  sceneSvg.appendChild(createSvgNode('path', {
    d: scene.shorePath,
    fill: 'none',
    stroke: 'rgba(255, 255, 255, 0.42)',
    'stroke-width': 7,
    'stroke-linecap': 'round',
  }));

  sceneSvg.appendChild(createSvgNode('path', {
    d: scene.roadPath,
    fill: 'none',
    stroke: 'rgba(112, 70, 34, 0.95)',
    'stroke-width': 44,
    'stroke-linecap': 'round',
  }));

  sceneSvg.appendChild(createSvgNode('path', {
    d: scene.roadPath,
    fill: 'none',
    stroke: 'rgba(231, 191, 111, 0.96)',
    'stroke-width': 24,
    'stroke-linecap': 'round',
  }));

  sceneSvg.appendChild(createSvgNode('path', {
    d: scene.roadPath,
    fill: 'none',
    stroke: 'rgba(255, 255, 255, 0.62)',
    'stroke-width': 3,
    'stroke-dasharray': '16 14',
    'stroke-linecap': 'round',
  }));

  const shine = createSvgNode('path', {
    d: scene.trackToShine || scene.track.map((point, pointIndex) => `${pointIndex === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`).join(' '),
    fill: 'none',
    stroke: 'rgba(255,255,255,0.12)',
    'stroke-width': 24,
    'stroke-linecap': 'round',
  });
  sceneSvg.appendChild(shine);

  sceneSvg.appendChild(createSvgNode('text', {
    x: 42,
    y: 666,
    fill: 'rgba(255,255,255,0.5)',
    'font-size': 18,
    'font-weight': '700',
    'letter-spacing': '0.08em',
  })).textContent = 'PROTECT THE BLUE ZONE';

  const collectibleData = getCollectiblePositions(scene);

  for (const collectible of collectibleData) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'can is-busy';
    button.dataset.reward = '3';
    button.setAttribute('aria-label', 'Collect floating can for bonus points');
    button.style.left = `${collectible.x}%`;
    button.style.top = `${collectible.y}%`;
    button.style.animationDelay = `${Math.random() * 1.2}s`;
    button.addEventListener('click', () => {
      if (button.classList.contains('is-collected')) {
        return;
      }
      button.classList.add('is-collected');
      const rect = button.getBoundingClientRect();
      award(3, 1, rect.left + rect.width / 2, rect.top - 6, '+3');
      pulseStatus('Collected a can. The shoreline just got a little cleaner.');
      checkSceneCompletionState();
    });
    collectiblesLayer.appendChild(button);
  }

  const carCount = 1 + Math.floor(Math.random() * 3);
  for (let carIndex = 0; carIndex < carCount; carIndex += 1) {
    hazardsLayer.appendChild(createTrafficElement(scene, 'car', carIndex === 0 ? 1 : -1, carIndex));
  }

  const shipCount = 1 + Math.floor(Math.random() * 3);
  for (let shipIndex = 0; shipIndex < shipCount; shipIndex += 1) {
    hazardsLayer.appendChild(createTrafficElement(scene, 'ship'));
  }

  card.scene = scene;
  card.metrics = metrics;
  card.playerLine = playerLine;
  card.collectiblesLayer = collectiblesLayer;
  card.hazardsLayer = hazardsLayer;
  card.hazard = hazardsLayer.firstElementChild;
  card.collectibles = Array.from(collectiblesLayer.querySelectorAll('.can'));
  card.progress = 0;
  card.error = 0;
  card.bestDistance = Number.POSITIVE_INFINITY;
  card.completionTriggered = false;

  return card;
}

function updateTrafficAnimation(deltaSeconds) {
  const cars = Array.from(document.querySelectorAll('.traffic--car'));
  cars.forEach((element) => {
    const state = element.trafficState;
    if (!state) {
      return;
    }

    state.progress += state.direction * state.speed * deltaSeconds;
    if (state.progress > 1) {
      state.progress -= 1;
    }
    if (state.progress < 0) {
      state.progress += 1;
    }

    const point = getRoadPoint(state.roadTrack, state.progress, state.laneOffset);
    const xPercent = (point.x / VIEWBOX_WIDTH) * 100;
    const yPercent = (point.y / VIEWBOX_HEIGHT) * 100;
    element.style.left = `${xPercent}%`;
    element.style.top = `${yPercent}%`;
    element.style.transform = `translate(-50%, -50%) rotate(${point.angle}deg) scaleX(${state.direction > 0 ? 1 : -1})`;
  });

  const ships = Array.from(document.querySelectorAll('.traffic--ship'));
  ships.forEach((element) => {
    const state = element.trafficState;
    if (!state) {
      return;
    }

    state.progress += state.direction * state.speed * deltaSeconds;
    if (state.progress > 1) {
      state.progress -= 1;
    }
    if (state.progress < 0) {
      state.progress += 1;
    }

    const point = getWaterPoint(state.progress, state.baseY, state.amplitude, state.direction);
    element.style.left = `${point.xPercent}%`;
    element.style.top = `${point.yPercent}%`;
    element.style.transform = `translate(-50%, -50%) rotate(${point.angle}deg) scaleX(${state.direction > 0 ? 1 : -1})`;
  });
}

let lastTrafficFrameTime = 0;

function animateTraffic(timestamp) {
  if (!lastTrafficFrameTime) {
    lastTrafficFrameTime = timestamp;
  }

  const deltaSeconds = (timestamp - lastTrafficFrameTime) / 1000;
  lastTrafficFrameTime = timestamp;
  updateTrafficAnimation(deltaSeconds);
  window.requestAnimationFrame(animateTraffic);
}

function renderScenes() {
  sceneStack.innerHTML = '';

  scenes.forEach((scene, index) => {
    const card = createSceneCard(scene, index);
    if (index === 0) {
      card.classList.add('is-visible', 'is-active');
    } else {
      card.classList.add('is-visible', 'is-next');
    }
    sceneStack.appendChild(card);
  });

  state.activeSceneElement = sceneStack.querySelector('.scene-card.is-active');
  state.activeLinePath = state.activeSceneElement.querySelector('[data-player-line]');
  state.completed = false;
  updateHUD();
  updateProgress(0);
}

function getActiveScene() {
  return scenes[state.activeSceneIndex];
}

function getActiveCard() {
  return sceneStack.querySelector(`.scene-card[data-scene-index="${state.activeSceneIndex}"]`);
}

function toScenePoint(event) {
  const card = getActiveCard();
  if (!card) {
    return null;
  }

  const rect = card.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * VIEWBOX_WIDTH;
  const y = ((event.clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT;
  return { x: clamp(x, 0, VIEWBOX_WIDTH), y: clamp(y, 0, VIEWBOX_HEIGHT), rect };
}

function clearStroke(card) {
  card.playerLine.setAttribute('d', '');
  card.playerLine.classList.remove('is-complete');
  card.progress = 0;
  card.error = 0;
  card.bestDistance = Number.POSITIVE_INFINITY;
  updateProgress(0);
}

function beginDrawing(event) {
  if (state.completed) {
    return;
  }

  if (event.target instanceof Element && event.target.closest('button, .scene-card__title')) {
    return;
  }

  const card = getActiveCard();
  if (!card || !card.classList.contains('is-active')) {
    return;
  }

  if (state.drawing) {
    return;
  }

  const point = toScenePoint(event);
  if (!point) {
    return;
  }

  const startPoint = { x: card.scene.track[0][0], y: card.scene.track[0][1] };
  const startDistance = distance(point, startPoint);
  if (startDistance > START_THRESHOLD) {
    pulseStatus('Start near the glowing bead at the beginning of the route.');
    return;
  }

  state.drawing = true;
  state.pointerId = event.pointerId ?? null;
  state.currentStrokePoints = [[point.x, point.y]];
  state.currentStrokeDistance = 0;
  state.currentStrokeError = 0;
  state.currentStrokeMaxProgress = 0;
  card.playerLine.setAttribute('d', pointsToPath(state.currentStrokePoints));
  routeProgress.style.width = '0%';
  gameStage.setPointerCapture?.(event.pointerId);
  pulseStatus('Tracing in progress. Stay inside the blue corridor.');
}

function extendDrawing(event) {
  if (!state.drawing) {
    return;
  }

  const card = getActiveCard();
  if (!card) {
    return;
  }

  const point = toScenePoint(event);
  if (!point) {
    return;
  }

  const lastPoint = state.currentStrokePoints[state.currentStrokePoints.length - 1];
  const previous = { x: lastPoint[0], y: lastPoint[1] };
  if (distance(point, previous) < 4) {
    return;
  }

  const projected = projectToTrack(point, card.metrics);
  state.currentStrokeDistance += distance(point, previous);
  state.currentStrokeMaxProgress = Math.max(state.currentStrokeMaxProgress, projected.progress);
  state.currentStrokeError = state.currentStrokeError * 0.92 + projected.distance * 0.08;
  card.bestDistance = Math.min(card.bestDistance, projected.distance);

  if (projected.distance > CORRIDOR_THRESHOLD * 1.18) {
    card.error += 1;
    if (card.error >= FAILURE_LIMIT) {
      pulseStatus('The line touched polluted water. Lift and try again.');
      finishDrawing(false);
      return;
    }
  }

  state.currentStrokePoints.push([point.x, point.y]);
  card.playerLine.setAttribute('d', pointsToPath(state.currentStrokePoints));
  updateProgress(state.currentStrokeMaxProgress / card.metrics.totalLength);
}

function finishDrawing(shouldCheckCompletion = true) {
  if (!state.drawing) {
    return;
  }

  const card = getActiveCard();
  state.drawing = false;
  if (state.pointerId !== null && gameStage.hasPointerCapture?.(state.pointerId)) {
    gameStage.releasePointerCapture(state.pointerId);
  }
  state.pointerId = null;

  if (!card) {
    return;
  }

  if (!shouldCheckCompletion) {
    clearStroke(card);
    return;
  }

  const startPoint = { x: card.scene.track[0][0], y: card.scene.track[0][1] };
  const endPoint = {
    x: card.scene.track[card.scene.track.length - 1][0],
    y: card.scene.track[card.scene.track.length - 1][1],
  };
  const first = { x: state.currentStrokePoints[0][0], y: state.currentStrokePoints[0][1] };
  const lastPointArray = state.currentStrokePoints[state.currentStrokePoints.length - 1];
  const last = { x: lastPointArray[0], y: lastPointArray[1] };
  const projectedEnd = projectToTrack(last, card.metrics);
  const averageError = state.currentStrokePoints.reduce((total, point) => total + projectToTrack({ x: point[0], y: point[1] }, card.metrics).distance, 0) / state.currentStrokePoints.length;
  const progressRatio = state.currentStrokeMaxProgress / card.metrics.totalLength;
  const startGap = distance(first, startPoint);
  const endGap = distance(last, endPoint);
  const endNearRoute = projectedEnd.distance < END_THRESHOLD;
  const goodCoverage = progressRatio >= 0.92;
  const safeLine = averageError <= CORRIDOR_THRESHOLD * 0.95;
  const startCorrect = startGap <= START_THRESHOLD;
  const endCorrect = endGap <= END_THRESHOLD;

  if (startCorrect && endCorrect && endNearRoute && goodCoverage && safeLine) {
    card.playerLine.classList.add('is-complete');
    const collectibleBonus = card.collectibles.filter((collectible) => collectible.classList.contains('is-collected')).length;
    const reward = card.scene.baseReward + collectibleBonus * 2;
    award(reward, 2 + collectibleBonus, last.x, last.y, `+${reward}`);
    pulseStatus(`${card.scene.name} sealed. The safe water line is holding.`);
    card.completionTriggered = true;
    window.setTimeout(() => advanceScene(), 650);
    return;
  }

  pulseStatus('The route needs a cleaner blue line. Try again and stay inside the glowing path.');
  clearStroke(card);
}

function checkSceneCompletionState() {
  const card = getActiveCard();
  if (!card || card.completionTriggered) {
    return;
  }

  const allCollected = card.collectibles.every((collectible) => collectible.classList.contains('is-collected'));
  if (allCollected) {
    pulseStatus('All cans cleared. Finish the blue safety line to move on.');
  }
}

function advanceScene() {
  const currentCard = getActiveCard();
  if (!currentCard) {
    return;
  }

  currentCard.classList.add('is-completed');
  currentCard.classList.remove('is-active');

  const nextIndex = state.activeSceneIndex + 1;
  state.activeSceneIndex = nextIndex;

  if (nextIndex >= scenes.length) {
    finishGame();
    return;
  }

  const nextCard = sceneStack.querySelector(`.scene-card[data-scene-index="${nextIndex}"]`);
  if (!nextCard) {
    return;
  }

  nextCard.classList.add('is-visible');
  requestAnimationFrame(() => {
    nextCard.classList.remove('is-next');
    nextCard.classList.add('is-active');
    state.activeSceneElement = nextCard;
    state.activeLinePath = nextCard.querySelector('[data-player-line]');
    clearStroke(nextCard);
  });

  updateHUD();
  updateProgress(0);
  pulseStatus(`${scenes[nextIndex].name} slides in. Trace the new route.`);
}

function finishGame() {
  state.completed = true;
  updateProgress(1);
  const bonus = 20;
  state.score += bonus;
  state.drops += 5;
  updateHUD();
  victoryCopy.textContent = `You protected all ${scenes.length} locations and earned ${state.drops} waterdrops. Keep the waters clean with another run.`;
  victoryOverlay.classList.remove('is-hidden');
  victoryOverlay.setAttribute('aria-hidden', 'false');
  pulseStatus('Victory. The final bay is protected.');
  launchConfetti();
}

function launchConfetti() {
  bubbleLayer.innerHTML = '';
  if (state.confettiTimer) {
    window.clearInterval(state.confettiTimer);
  }

  const colors = [34, 186, 255, 164, 88, 205];
  let emitted = 0;

  state.confettiTimer = window.setInterval(() => {
    if (emitted >= 72) {
      window.clearInterval(state.confettiTimer);
      state.confettiTimer = null;
      return;
    }

    emitted += 1;
    const confetti = document.createElement('span');
    confetti.className = 'confetti-piece';
    confetti.style.setProperty('--hue', String(colors[emitted % colors.length]));
    confetti.style.setProperty('--duration', `${2.8 + Math.random() * 1.8}s`);
    confetti.style.setProperty('--turn', `${Math.random() * 180}deg`);
    confetti.style.setProperty('--x-start', `${Math.random() * window.innerWidth}`);
    confetti.style.setProperty('--x-end', `${Math.random() * window.innerWidth}`);
    bubbleLayer.appendChild(confetti);
    window.setTimeout(() => confetti.remove(), 4800);
  }, 60);
}

function resetRun() {
  if (state.confettiTimer) {
    window.clearInterval(state.confettiTimer);
    state.confettiTimer = null;
  }

  bubbleLayer.innerHTML = '';
  victoryOverlay.classList.add('is-hidden');
  victoryOverlay.setAttribute('aria-hidden', 'true');
  state.score = 0;
  state.drops = 0;
  state.activeSceneIndex = 0;
  state.drawing = false;
  state.pointerId = null;
  state.currentStrokePoints = [];
  state.currentStrokeDistance = 0;
  state.currentStrokeError = 0;
  state.currentStrokeMaxProgress = 0;
  state.completed = false;
  renderScenes();
  updateHUD();
  updateProgress(0);
  pulseStatus('Trace the blue safety line and click the floating cans to collect extra points.');
}

gameStage.addEventListener('pointerdown', beginDrawing);
gameStage.addEventListener('pointermove', extendDrawing);
gameStage.addEventListener('pointerup', () => finishDrawing(true));
gameStage.addEventListener('pointercancel', () => finishDrawing(false));
gameStage.addEventListener('pointerleave', () => {
  if (state.drawing) {
    finishDrawing(true);
  }
});
resetBtn.addEventListener('click', resetRun);
playAgainBtn.addEventListener('click', resetRun);

renderScenes();
updateHUD();
window.requestAnimationFrame(animateTraffic);
updateProgress(0);
pulseStatus('Trace the blue safety line and click the floating cans to collect extra points.');
