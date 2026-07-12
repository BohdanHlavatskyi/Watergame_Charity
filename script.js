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
  { id: 'sedan', color: '#ff7b59', accent: '#c93d3a', glass: '#8fc7ea', bodyPath: 'M20 38L28 20L46 14L74 14L91 20L98 37L94 47L77 50L44 50L22 50L14 47Z', roofPath: 'M34 22L46 18L74 18L86 23L80 30L46 30L34 30Z', windowPath: 'M40 22L56 18L72 18L80 24L72 30L44 30Z', doorPath: 'M44 30L44 42L72 42L72 30Z' },
  { id: 'coupe', color: '#4f8cff', accent: '#2348b2', glass: '#9ed9f7', bodyPath: 'M24 40L32 20L50 14L76 14L93 22L100 37L95 47L77 50L46 50L22 49L14 46Z', roofPath: 'M32 23L48 18L72 18L86 23L80 30L56 30L38 30Z', windowPath: 'M39 23L55 20L69 20L80 24L72 29L47 29Z', doorPath: 'M46 29L46 42L70 42L70 29Z' },
  { id: 'suv', color: '#f1b24a', accent: '#a65f1d', glass: '#8ecbf2', bodyPath: 'M20 40L26 22L42 16L74 16L90 22L98 37L96 48L80 51L44 51L18 48Z', roofPath: 'M34 22L44 18L74 18L85 23L80 30L48 30L32 30Z', windowPath: 'M39 22L48 19L72 19L80 24L73 30L43 30Z', doorPath: 'M44 30L44 43L72 43L72 30Z' },
  { id: 'pickup', color: '#3fcf7a', accent: '#117d49', glass: '#9fdcf4', bodyPath: 'M18 40L24 20L40 14L82 14L97 22L101 38L96 48L82 50L42 50L22 50L14 47Z', roofPath: 'M34 22L44 18L74 18L86 23L83 30L44 30L32 30Z', windowPath: 'M38 22L48 19L72 19L82 24L76 30L44 30Z', doorPath: 'M44 30L44 42L72 42L72 30Z' },
  { id: 'hatchback', color: '#f26192', accent: '#a53463', glass: '#cdeaff', bodyPath: 'M22 38L30 20L50 16L74 16L90 22L97 37L92 46L76 50L46 50L24 49L16 45Z', roofPath: 'M34 22L46 18L72 18L84 24L78 30L46 30L34 30Z', windowPath: 'M40 22L54 19L70 19L78 24L70 30L44 30Z', doorPath: 'M44 30L44 42L70 42L70 30Z' },
  { id: 'wagon', color: '#7c5cff', accent: '#4a2da8', glass: '#bfe9ff', bodyPath: 'M18 39L27 20L43 14L77 14L92 20L99 34L97 47L80 50L44 50L24 49L15 46Z', roofPath: 'M32 22L44 18L74 18L84 24L80 30L44 30L32 30Z', windowPath: 'M38 22L52 19L70 19L80 24L73 30L42 30Z', doorPath: 'M44 30L44 42L72 42L72 30Z' },
  { id: 'convertible', color: '#2dc6b8', accent: '#0d6f63', glass: '#d7f2ff', bodyPath: 'M22 40L32 20L50 14L76 14L92 24L98 37L93 47L74 50L46 50L23 50L14 46Z', roofPath: 'M34 22L48 18L72 18L84 24L78 31L48 31L34 31Z', windowPath: 'M40 22L54 20L70 20L78 25L70 31L44 31Z', doorPath: 'M44 31L44 42L70 42L70 31Z' },
  { id: 'van', color: '#ff9b3f', accent: '#a95811', glass: '#cceeff', bodyPath: 'M16 40L24 20L44 14L80 14L95 20L100 38L95 47L80 50L44 50L24 50L14 46Z', roofPath: 'M32 22L44 18L78 18L90 24L84 31L44 31L32 31Z', windowPath: 'M38 22L50 19L72 19L82 24L74 31L42 31Z', doorPath: 'M44 31L44 42L72 42L72 31Z' },
  { id: 'sport', color: '#e85d5d', accent: '#8c2023', glass: '#bfe8ff', bodyPath: 'M22 39L32 18L52 12L74 12L91 20L98 36L93 47L76 50L42 50L21 49L14 46Z', roofPath: 'M34 18L48 14L70 14L84 20L78 29L46 29L34 29Z', windowPath: 'M40 18L54 15L68 15L78 21L70 29L44 29Z', doorPath: 'M44 29L44 42L68 42L68 29Z' },
  { id: 'muscle', color: '#6abf69', accent: '#246a31', glass: '#dff6ff', bodyPath: 'M20 40L28 18L46 12L76 12L92 18L100 36L97 47L79 50L46 50L24 50L14 47Z', roofPath: 'M34 18L48 14L72 14L84 20L80 29L46 29L34 29Z', windowPath: 'M40 18L54 15L70 15L78 21L70 29L44 29Z', doorPath: 'M44 29L44 42L70 42L70 29Z' },
];

const shipVariants = [
  { id: 'cargo', color: '#d8e4ef', accent: '#6c7f8f', glass: '#4b5a69', hullPath: 'M14 42L22 30L40 24L72 24L90 30L98 42L90 46L72 50L40 50L22 46Z', deckPath: 'M24 34L38 30L72 30L84 34L78 40L40 40Z', mastPath: 'M46 18L46 34', sailPath: 'M46 18L68 18L46 32Z', wakePath: 'M12 46C20 44 30 44 42 46C54 48 66 48 78 46C88 44 96 44 102 46' },
  { id: 'tanker', color: '#f4f7fb', accent: '#7d94aa', glass: '#465766', hullPath: 'M12 42L20 28L42 22L74 22L94 28L100 42L92 48L76 52L42 52L22 48Z', deckPath: 'M24 32L38 28L74 28L86 32L78 40L38 40Z', mastPath: 'M48 16L48 34', sailPath: 'M48 16L72 16L48 32Z', wakePath: 'M10 46C18 44 28 44 42 46C56 48 68 48 82 46C90 44 97 44 104 46' },
  { id: 'yacht', color: '#ffdf8c', accent: '#a95a1f', glass: '#8cc8ef', hullPath: 'M14 40L24 28L44 24L72 24L90 28L98 40L86 46L72 50L44 50L24 46Z', deckPath: 'M24 30L40 28L70 28L84 32L74 38L40 38Z', mastPath: 'M44 14L44 32', sailPath: 'M44 14L64 14L44 31Z', wakePath: 'M12 46C20 44 28 44 40 46C52 48 64 48 78 46C86 44 94 44 102 46' },
  { id: 'ferry', color: '#6bc3ff', accent: '#296eb0', glass: '#d7eefc', hullPath: 'M12 40L20 28L40 22L76 22L96 28L100 40L92 46L74 50L42 50L24 46Z', deckPath: 'M24 30L36 26L76 26L88 30L80 38L34 38Z', mastPath: 'M50 16L50 32', sailPath: 'M50 16L70 16L50 31Z', wakePath: 'M10 46C20 44 32 44 44 46C56 48 68 48 80 46C90 44 98 44 104 46' },
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
    waterPath: 'M0 524 C102 484, 188 454, 284 474 C366 492, 428 530, 528 540 C657 552, 764 494, 874 510 C931 518, 966 536, 1000 550 L1000 700 L0 700 Z',
    shipWaterPath: 'M0 568 C102 528, 188 498, 284 518 C366 536, 428 574, 528 584 C657 596, 764 538, 874 554 C931 562, 966 580, 1000 594 L1000 700 L0 700 Z',
    shorePath: 'M0 492 C108 444, 182 428, 286 444 C375 458, 428 500, 534 510 C651 522, 755 470, 864 484 C920 491, 964 510, 1000 530',
    roadPath: 'M0 150 C110 124, 220 114, 326 120 C430 126, 526 150, 632 158 C736 166, 830 154, 932 134 C967 126, 984 122, 1000 118',
    roadTrack: [
      [0, 150],
      [110, 124],
      [220, 114],
      [326, 120],
      [430, 126],
      [526, 150],
      [632, 158],
      [736, 166],
      [830, 154],
      [932, 134],
      [1000, 118],
    ],
    decorPath: 'M0 250 C110 228, 180 210, 286 224 C380 238, 460 287, 549 294 C677 305, 765 259, 866 272 C926 279, 968 299, 1000 314 L1000 0 L0 0 Z',
    track: [
      [20, 224],
      [132, 198],
      [244, 186],
      [356, 190],
      [468, 204],
      [580, 220],
      [692, 216],
      [804, 224],
      [916, 238],
      [980, 252],
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
    waterPath: 'M0 528 C76 486, 158 452, 252 444 C347 434, 420 462, 494 486 C584 516, 671 530, 770 518 C867 506, 935 472, 1000 428 L1000 700 L0 700 Z',
    shipWaterPath: 'M0 570 C76 528, 158 494, 252 486 C347 476, 420 504, 494 528 C584 558, 671 572, 770 560 C867 548, 935 514, 1000 470 L1000 700 L0 700 Z',
    shorePath: 'M0 496 C83 452, 161 422, 252 414 C345 406, 423 432, 496 456 C588 488, 675 502, 772 492 C866 482, 933 450, 1000 418',
    roadPath: 'M0 168 C96 144, 198 136, 300 146 C396 156, 512 184, 614 184 C720 184, 812 160, 912 150 C948 146, 980 142, 1000 138',
    roadTrack: [
      [0, 168],
      [96, 144],
      [198, 136],
      [300, 146],
      [396, 156],
      [512, 184],
      [614, 184],
      [720, 184],
      [812, 160],
      [912, 150],
      [1000, 138],
    ],
    decorPath: 'M0 240 C96 258, 188 224, 272 209 C361 193, 446 206, 529 222 C641 246, 744 226, 844 206 C914 191, 965 186, 1000 192 L1000 0 L0 0 Z',
    track: [
      [22, 260],
      [134, 236],
      [246, 218],
      [358, 206],
      [470, 200],
      [582, 208],
      [694, 224],
      [806, 242],
      [918, 260],
      [978, 276],
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
    waterPath: 'M0 522 C84 486, 152 466, 227 476 C294 485, 343 518, 406 554 C479 596, 560 630, 649 634 C750 639, 846 610, 932 576 C968 561, 989 548, 1000 540 L1000 700 L0 700 Z',
    shipWaterPath: 'M0 566 C84 530, 152 510, 227 520 C294 529, 343 562, 406 598 C479 640, 560 674, 649 678 C750 683, 846 654, 932 620 C968 605, 989 592, 1000 584 L1000 700 L0 700 Z',
    shorePath: 'M0 490 C84 456, 155 438, 230 446 C301 454, 347 486, 411 522 C486 564, 561 596, 649 602 C752 609, 846 582, 936 550 C971 537, 990 526, 1000 518',
    roadPath: 'M0 156 C102 132, 208 124, 310 134 C412 144, 514 168, 620 172 C728 176, 822 158, 922 142 C956 134, 984 128, 1000 126',
    roadTrack: [
      [0, 156],
      [102, 132],
      [208, 124],
      [310, 134],
      [412, 144],
      [514, 168],
      [620, 172],
      [728, 176],
      [822, 158],
      [922, 142],
      [1000, 126],
    ],
    decorPath: 'M0 248 C90 222, 180 217, 263 225 C354 234, 437 214, 512 185 C619 144, 735 131, 845 158 C920 176, 970 196, 1000 210 L1000 0 L0 0 Z',
    track: [
      [18, 212],
      [130, 194],
      [242, 182],
      [354, 178],
      [466, 188],
      [578, 204],
      [690, 220],
      [802, 234],
      [914, 248],
      [982, 262],
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
    waterPath: 'M0 526 C92 486, 172 454, 256 466 C336 477, 404 518, 484 530 C576 545, 668 540, 760 512 C835 490, 916 473, 1000 490 L1000 700 L0 700 Z',
    shipWaterPath: 'M0 570 C92 530, 172 498, 256 510 C336 521, 404 562, 484 574 C576 589, 668 584, 760 556 C835 534, 916 517, 1000 534 L1000 700 L0 700 Z',
    shorePath: 'M0 492 C92 454, 173 428, 257 440 C339 452, 407 492, 486 504 C578 519, 668 514, 760 486 C835 464, 917 446, 1000 462',
    roadPath: 'M0 144 C104 122, 214 114, 320 122 C432 130, 544 152, 646 158 C748 164, 838 152, 938 138 C970 132, 990 128, 1000 124',
    roadTrack: [
      [0, 144],
      [104, 122],
      [214, 114],
      [320, 122],
      [432, 130],
      [544, 152],
      [646, 158],
      [748, 164],
      [838, 152],
      [938, 138],
      [1000, 124],
    ],
    decorPath: 'M0 226 C96 244, 186 214, 276 198 C372 181, 457 196, 542 218 C640 242, 746 226, 846 196 C914 178, 970 174, 1000 180 L1000 0 L0 0 Z',
    track: [
      [20, 230],
      [132, 206],
      [244, 192],
      [356, 184],
      [468, 188],
      [580, 202],
      [692, 218],
      [804, 232],
      [916, 248],
      [980, 258],
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
    waterPath: 'M0 516 C84 480, 160 458, 240 466 C316 474, 384 512, 458 526 C539 542, 620 542, 706 520 C782 500, 858 482, 1000 494 L1000 700 L0 700 Z',
    shipWaterPath: 'M0 560 C84 524, 160 502, 240 510 C316 518, 384 556, 458 570 C539 586, 620 586, 706 564 C782 544, 858 526, 1000 538 L1000 700 L0 700 Z',
    shorePath: 'M0 482 C90 448, 166 424, 240 434 C318 444, 386 480, 460 494 C542 510, 621 510, 706 488 C782 468, 862 450, 1000 462',
    roadPath: 'M0 146 C108 126, 220 120, 332 128 C444 136, 568 160, 682 166 C768 170, 856 156, 938 140 C970 134, 988 130, 1000 126',
    roadTrack: [
      [0, 146],
      [108, 126],
      [220, 120],
      [332, 128],
      [444, 136],
      [568, 160],
      [682, 166],
      [768, 170],
      [856, 156],
      [938, 140],
      [1000, 126],
    ],
    decorPath: 'M0 236 C94 208, 176 200, 258 208 C346 217, 430 198, 510 174 C621 144, 740 136, 850 164 C920 182, 970 198, 1000 210 L1000 0 L0 0 Z',
    track: [
      [20, 226],
      [132, 202],
      [244, 190],
      [356, 184],
      [468, 190],
      [580, 204],
      [692, 220],
      [804, 236],
      [916, 250],
      [980, 260],
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

function getRouteTrack(scene) {
  const offset = scene.routeOffset ?? 0;
  return scene.track.map(([x, y]) => [x, y + offset]);
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

function createTrafficElement(scene, type, direction = 1, laneIndex = 0, laneSide = 'left') {
  const variants = type === 'car' ? carVariants : shipVariants;
  const variant = variants[Math.floor(Math.random() * variants.length)];
  const element = document.createElement('div');
  element.className = `traffic traffic--${type} traffic--${type}--${variant.id}`;
  element.setAttribute('aria-hidden', 'true');
  element.style.setProperty('--traffic-color', variant.color);
  element.style.setProperty('--traffic-accent', variant.accent);
  element.style.setProperty('--traffic-glass', variant.glass);

  if (type === 'car') {
    const bodyPath = variant.bodyPath || 'M20 38L28 20L46 14L74 14L91 20L98 37L94 47L77 50L44 50L22 50L14 47Z';
    const roofPath = variant.roofPath || 'M34 22L46 18L74 18L86 23L80 30L46 30L34 30Z';
    const windowPath = variant.windowPath || 'M40 22L56 18L72 18L80 24L72 30L44 30Z';
    const doorPath = variant.doorPath || 'M44 30L44 42L72 42L72 30Z';

    element.innerHTML = `
      <div class="traffic__shadow"></div>
      <svg class="traffic__art" viewBox="0 0 112 56" xmlns="http://www.w3.org/2000/svg">
        <path class="traffic__car-body" d="${bodyPath}" />
        <path class="traffic__car-highlight" d="M28 34L40 24L70 24L84 31L76 38L44 38Z" />
        <path class="traffic__car-roof" d="${roofPath}" />
        <path class="traffic__car-window" d="${windowPath}" />
        <path class="traffic__car-door" d="${doorPath}" />
        <path class="traffic__car-bumper" d="M12 44L12 47L18 49L22 49L22 44Z" />
        <path class="traffic__car-bumper traffic__car-bumper--rear" d="M92 44L92 47L86 49L82 49L82 44Z" />
        <path class="traffic__car-grille" d="M54 41L66 41L66 44L54 44Z" />
        <path class="traffic__car-light traffic__car-light--front" d="M18 40L20 40L20 43L18 43Z" />
        <path class="traffic__car-light traffic__car-light--rear" d="M86 40L88 40L88 43L86 43Z" />
        <circle class="traffic__wheel traffic__wheel--rear" cx="34" cy="49" r="10" />
        <circle class="traffic__wheel traffic__wheel--front" cx="78" cy="49" r="10" />
      </svg>
    `;
    const laneOffset = laneSide === 'left' ? -20 : 20;
    const laneSpacing = 0.24 + Math.random() * 0.08;
    const initialProgress = direction > 0
      ? laneIndex * laneSpacing + Math.random() * 0.03
      : 1 - (laneIndex * laneSpacing + Math.random() * 0.03);
    element.trafficState = {
      roadTrack: scene.roadTrack,
      progress: initialProgress,
      direction,
      speed: 0.06 + Math.random() * 0.012 + laneIndex * 0.002,
      laneOffset,
      laneSide,
    };
    element.style.left = '0%';
    element.style.top = '0%';
  } else {
    const hullPath = variant.hullPath || 'M14 42L22 30L40 24L72 24L90 30L98 42L90 46L72 50L40 50L22 46Z';
    const deckPath = variant.deckPath || 'M24 34L38 30L72 30L84 34L78 40L40 40Z';
    const mastPath = variant.mastPath || 'M46 18L46 34';
    const sailPath = variant.sailPath || 'M46 18L68 18L46 32Z';
    const wakePath = variant.wakePath || 'M12 46C20 44 30 44 42 46C54 48 66 48 78 46C88 44 96 44 102 46';

    element.innerHTML = `
      <div class="traffic__shadow"></div>
      <svg class="traffic__art" viewBox="0 0 112 56" xmlns="http://www.w3.org/2000/svg">
        <path class="traffic__ship-hull" d="${hullPath}" />
        <path class="traffic__ship-deck" d="${deckPath}" />
        <path class="traffic__ship-mast" d="${mastPath}" />
        <path class="traffic__ship-sail" d="${sailPath}" />
        <path class="traffic__ship-window" d="M42 28L50 28L50 34L42 34Z" />
        <path class="traffic__ship-wake" d="${wakePath}" />
      </svg>
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
  const routeTrack = getRouteTrack(scene);
  const metrics = getTrackMetrics(routeTrack);
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
      <path class="route-layer route-guide" d="${pointsToPath(routeTrack)}"></path>
      <circle class="route-start" cx="${routeTrack[0][0]}" cy="${routeTrack[0][1]}" r="12" fill="#8df0ff"></circle>
      <circle class="route-end" cx="${routeTrack[routeTrack.length - 1][0]}" cy="${routeTrack[routeTrack.length - 1][1]}" r="12" fill="#58f0bc"></circle>
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

  if (scene.shipWaterPath) {
    sceneSvg.appendChild(createSvgNode('path', {
      d: scene.shipWaterPath,
      fill: `url(#water-${scene.id})`,
      opacity: '0.94',
    }));
  }

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
    d: scene.trackToShine || routeTrack.map((point, pointIndex) => `${pointIndex === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`).join(' '),
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

  const leftLaneCarCount = 1 + Math.floor(Math.random() * 3);
  for (let carIndex = 0; carIndex < leftLaneCarCount; carIndex += 1) {
    hazardsLayer.appendChild(createTrafficElement(scene, 'car', 1, carIndex, 'left'));
  }

  const rightLaneCarCount = 1 + Math.floor(Math.random() * 3);
  for (let carIndex = 0; carIndex < rightLaneCarCount; carIndex += 1) {
    hazardsLayer.appendChild(createTrafficElement(scene, 'car', -1, carIndex, 'right'));
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
