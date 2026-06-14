const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/* ===================================================== */
/* 1. ШЛЯХИ ДО РЕАЛЬНИХ ЗВУКІВ (якщо підкладеш свої файли) */
/* ===================================================== */
const weaponSounds = {
  ak47:   'sounds/ak47.wav',
  m4a4:   'sounds/m4a4.wav',
  m4a1s:  'sounds/m4a1s.wav',
  awp:    'sounds/awp.wav',
  ssg08:  'sounds/ssg08.wav',
  deagle: 'sounds/deagle.wav',
  glock:  'sounds/glock.wav',
  usps:   'sounds/usps.wav',
  p90:    'sounds/p90.wav',
  mac10:  'sounds/mac10.wav',
  galil:  'sounds/galil.wav',
  famas:  'sounds/famas.wav',
};

/* ===================================================== */
/* 2. РЕВЕРБ ТА ДИСТОРШН ДЛЯ FALLBACK-СИНТЕЗУ            */
/* ===================================================== */
function createReverbImpulse(duration, decay) {
  const length = audioCtx.sampleRate * duration;
  const impulse = audioCtx.createBuffer(2, length, audioCtx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}

const reverb = audioCtx.createConvolver();
reverb.buffer = createReverbImpulse(1.4, 2.5);

function createDistortion(amount) {
  const shaper = audioCtx.createWaveShaper();
  const samples = 44100;
  const curve = new Float32Array(samples);
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    curve[i] = Math.tanh(x * amount);
  }
  shaper.curve = curve;
  shaper.oversample = '4x';
  return shaper;
}

/* ===================================================== */
/* 3. КОНФІГИ ДЛЯ FALLBACK-СИНТЕЗУ                       */
/* ===================================================== */
const weaponConfigs = {
  ak47:   { crackFreq: 2200, crackQ: 1.2, crackVol: 1.0,  bodyFreq: 130, bodyVol: 0.8,  bodyDecay: 0.15, tailAmount: 0.25, distortion: 8,  volume: 0.9  },
  m4a4:   { crackFreq: 2800, crackQ: 1.5, crackVol: 0.9,  bodyFreq: 150, bodyVol: 0.7,  bodyDecay: 0.12, tailAmount: 0.2,  distortion: 6,  volume: 0.85 },
  m4a1s:  { crackFreq: 2400, crackQ: 2,   crackVol: 0.7,  bodyFreq: 140, bodyVol: 0.6,  bodyDecay: 0.1,  tailAmount: 0.15, distortion: 4,  volume: 0.7  },
  awp:    { crackFreq: 1200, crackQ: 0.8, crackVol: 1.0,  bodyFreq: 55,  bodyVol: 1.0,  bodyDecay: 0.6,  tailAmount: 0.6,  distortion: 10, volume: 1.0  },
  ssg08:  { crackFreq: 1400, crackQ: 0.9, crackVol: 0.9,  bodyFreq: 65,  bodyVol: 0.9,  bodyDecay: 0.5,  tailAmount: 0.5,  distortion: 8,  volume: 0.95 },
  deagle: { crackFreq: 1800, crackQ: 1,   crackVol: 1.0,  bodyFreq: 100, bodyVol: 0.9,  bodyDecay: 0.3,  tailAmount: 0.35, distortion: 9,  volume: 0.95 },
  glock:  { crackFreq: 3000, crackQ: 1.8, crackVol: 0.7,  bodyFreq: 200, bodyVol: 0.5,  bodyDecay: 0.08, tailAmount: 0.1,  distortion: 3,  volume: 0.65 },
  usps:   { crackFreq: 2600, crackQ: 2,   crackVol: 0.6,  bodyFreq: 180, bodyVol: 0.45, bodyDecay: 0.08, tailAmount: 0.1,  distortion: 3,  volume: 0.6  },
  p90:    { crackFreq: 3200, crackQ: 1.6, crackVol: 0.75, bodyFreq: 220, bodyVol: 0.5,  bodyDecay: 0.06, tailAmount: 0.08, distortion: 4,  volume: 0.65 },
  mac10:  { crackFreq: 3000, crackQ: 1.4, crackVol: 0.8,  bodyFreq: 230, bodyVol: 0.55, bodyDecay: 0.06, tailAmount: 0.1,  distortion: 5,  volume: 0.7  },
  galil:  { crackFreq: 2300, crackQ: 1.3, crackVol: 0.9,  bodyFreq: 140, bodyVol: 0.75, bodyDecay: 0.13, tailAmount: 0.22, distortion: 7,  volume: 0.85 },
  famas:  { crackFreq: 2700, crackQ: 1.6, crackVol: 0.85, bodyFreq: 160, bodyVol: 0.65, bodyDecay: 0.1,  tailAmount: 0.18, distortion: 5,  volume: 0.8  },
};

function playSynthSound(cfg) {
  const now = audioCtx.currentTime;

  const masterGain = audioCtx.createGain();
  masterGain.gain.value = cfg.volume;
  masterGain.connect(audioCtx.destination);

  // --- ТРІСК ---
  const crackBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.06, audioCtx.sampleRate);
  const crackData = crackBuffer.getChannelData(0);
  for (let i = 0; i < crackData.length; i++) crackData[i] = Math.random() * 2 - 1;

  const crackSource = audioCtx.createBufferSource();
  crackSource.buffer = crackBuffer;

  const crackFilter = audioCtx.createBiquadFilter();
  crackFilter.type = 'bandpass';
  crackFilter.frequency.value = cfg.crackFreq;
  crackFilter.Q.value = cfg.crackQ;

  const crackGain = audioCtx.createGain();
  crackGain.gain.setValueAtTime(cfg.crackVol, now);
  crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  const distortion = createDistortion(cfg.distortion);

  crackSource.connect(crackFilter);
  crackFilter.connect(distortion);
  distortion.connect(crackGain);
  crackGain.connect(masterGain);

  // --- БАС / УДАР ---
  const body = audioCtx.createOscillator();
  body.type = 'triangle';
  body.frequency.setValueAtTime(cfg.bodyFreq, now);
  body.frequency.exponentialRampToValueAtTime(cfg.bodyFreq * 0.4, now + cfg.bodyDecay);

  const bodyGain = audioCtx.createGain();
  bodyGain.gain.setValueAtTime(cfg.bodyVol, now);
  bodyGain.gain.exponentialRampToValueAtTime(0.001, now + cfg.bodyDecay);

  body.connect(bodyGain);
  bodyGain.connect(masterGain);

  // --- ХВІСТ / РЕВЕРБ ---
  const tailGain = audioCtx.createGain();
  tailGain.gain.value = cfg.tailAmount;
  masterGain.connect(reverb);
  reverb.connect(tailGain);
  tailGain.connect(audioCtx.destination);

  crackSource.start(now);
  crackSource.stop(now + 0.06);
  body.start(now);
  body.stop(now + cfg.bodyDecay);
}

/* ===================================================== */
/* 4. ПЕРЕВІРКА НАЯВНОСТІ ФАЙЛІВ + ПОПЕРЕДНЄ ЗАВАНТАЖЕННЯ */
/* ===================================================== */
const audioCache = {};       // готові Audio-об'єкти (якщо файл існує)
const fileAvailable = {};    // true / false / undefined (ще перевіряється)

for (const [key, path] of Object.entries(weaponSounds)) {
  const audio = new Audio();
  audio.preload = 'auto';

  audio.addEventListener('canplaythrough', () => {
    fileAvailable[key] = true;
  });
  audio.addEventListener('error', () => {
    fileAvailable[key] = false;
  });

  audio.src = path;
  audioCache[key] = audio;
}

/* ===================================================== */
/* 5. ОБРОБНИКИ КНОПОК                                    */
/* ===================================================== */
document.querySelectorAll('.weapon-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const weaponId = btn.dataset.weapon;

    if (fileAvailable[weaponId] === true) {
      // є реальний файл — граємо його
      const sound = audioCache[weaponId].cloneNode();
      sound.play();
    } else {
      // файлу немає (або ще не завантажився) — синтез
      const cfg = weaponConfigs[weaponId];
      if (cfg) playSynthSound(cfg);
    }

    btn.classList.add('firing');
    setTimeout(() => btn.classList.remove('firing'), 150);
  });
});