// document.addEventListener("DOMContentLoaded", () => {
// --DATASET--
const heaterBank = [
  {
    key: "Q",
    id: "heater-1",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
  },
  {
    key: "W",
    id: "heater-2",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
  },
  {
    key: "E",
    id: "heater-3",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
  },
  {
    key: "A",
    id: "heater-4",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
  },
  {
    key: "S",
    id: "clap",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
  },
  {
    key: "D",
    id: "open-hh",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
  },
  {
    key: "Z",
    id: "kick-n-hat",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
  },
  {
    key: "X",
    id: "kick",
    src: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
  },
  {
    key: "C",
    id: "closed-hh",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3",
  },
];

const pianoBank = [
  {
    key: "Q",
    id: "Chord-1",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3",
  },
  {
    key: "W",
    id: "Chord-2",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3",
  },
  {
    key: "E",
    id: "Chord-3",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3",
  },
  {
    key: "A",
    id: "Shaker",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3",
  },
  {
    key: "S",
    id: "Open-HH",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3",
  },
  {
    key: "D",
    id: "Closed-HH",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3",
  },
  {
    key: "Z",
    id: "Punchy-Kick",
    src: "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3",
  },
  {
    key: "X",
    id: "Side-Stick",
    src: "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3",
  },
  {
    key: "C",
    id: "Snare",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3",
  },
];

// --ELEMENTS--
const padsEl = document.querySelectorAll(".drum-pad");
// create map in a key, pad pair
const padMap = new Map();
padsEl.forEach((pad) => {
  const key = pad.getAttribute("value");
  padMap.set(key, pad);
});

const displayEl = document.getElementById("display");
const powerSwitchEl = document.querySelector("#power-switch");
const volumeSliderEl = document.getElementById("volume-slider");
const muteEl = document.querySelector(".material-symbols-outlined");
const bankBtnEl = document.querySelectorAll(".bank-btn");

// --STATE MANAGER--
let userData = {
  power: true,
  volume: 0.5,
  muted: false,
  bank: "heater",
};

let timer;

// --FUNCTION--
function togglePower(e) {
  //update power status
  if (e.target.checked) {
    userData.power = true;
  } else {
    userData.power = false;
  }
  // UI renderer for power status
  const statusDotEl = document.querySelector(".status-dot");
  const statusTextEl = document.getElementById("status-text");

  statusDotEl.classList.toggle("offline", !userData.power);
  statusTextEl.textContent = userData.power ? "Connected" : "Disconnected";
  displayEl.textContent = "";

  // Accessibility: update title for screen reader
  e.target.title = userData.power ? "Power On" : "Power Off";
}

function handleBankSelection(e) {
  // UI renderer
  bankBtnEl.forEach((btn) => {
    btn.classList.remove("active");
  });
  // update userData.bank
  userData.bank = e.target.textContent.trim().toLowerCase();
  e.target.classList.add("active");

  // switch bank (update: button.drum-pad (id) , audio (src))
  const activeBank = userData.bank === "piano" ? pianoBank : heaterBank;

  activeBank.forEach((sound) => {
    // get specific audio element by its ID
    const audioEl = document.getElementById(sound.key);
    //find the parent
    const buttonEl = audioEl.parentElement;

    //update button id
    buttonEl.id = sound.id;
    //update audio src
    audioEl.src = sound.src;
  });

  // UI Renderer
  displayEl.classList.remove("hidden");
  displayEl.textContent = `${userData.bank} Mode`;
  clearTimeout(timer);
  timer = setTimeout(() => {
    displayEl.classList.add("hidden");
  }, 1000);
}

function handleMute() {
  userData.muted = !userData.muted;
  const muted = "volume_off";
  const unmuted = "volume_up";

  displayEl.classList.remove("hidden");

  muteEl.textContent = userData.muted ? muted : unmuted;
  displayEl.textContent = userData.muted ? "Muted" : "Unmuted";

  clearTimeout(timer);
  timer = setTimeout(() => {
    displayEl.classList.add("hidden");
  }, 1000);
}

function handleSetVolume(e) {
  const volume = e.target.value / 100;
  userData.volume = volume;

  //UI render volume
  displayEl.classList.remove("hidden");
  displayEl.textContent = `Volume: ${e.target.value}`;

  clearTimeout(timer);
  timer = setTimeout(() => {
    displayEl.classList.add("hidden");
  }, 1000);
}

function playSound(e) {
  if (!userData.power) return;

  let key;
  let padBtnEl;

  if (e.type === "click") {
    //click event
    padBtnEl = e.currentTarget;
    key = padBtnEl.getAttribute("value"); //get button value or key
  } else {
    // keyboard event
    key = e.key.toUpperCase();
    padBtnEl = padMap.get(key);
  }
  // safety check: if key isn't part of our set, exit
  if (!padBtnEl) return;

  const audio = document.getElementById(key);
  if (!audio) return;

  // UI RENDERER
  const formattedId = padBtnEl.id.replace(/-/g, " ").toUpperCase();
  displayEl.textContent = formattedId;

  // ensure display is not hidden
  displayEl.classList.remove("hidden");

  //play, set volume
  audio.volume = userData.muted ? 0 : userData.volume;
  audio.currentTime = 0;
  // prevents errors in browsers that block autoplay.
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      console.warn("Audio playback failed:", error);
    });
  }
}

// --UTILITY FUNCTION--
function handlePadActiveClass(e, isActive) {
  const key = e.key?.toUpperCase();
  if (!key) return;
  const pad = document.querySelector(`.drum-pad[value="${key}"]`);
  if (pad) {
    pad.classList.toggle("active", isActive);
  }
}

// --EVENTLISTENER--
padsEl.forEach((pad) => {
  pad.addEventListener("click", (e) => playSound(e));
});

document.addEventListener("keydown", (e) => playSound(e));
document.addEventListener("keydown", (e) => handlePadActiveClass(e, true));
document.addEventListener("keyup", (e) => handlePadActiveClass(e, false));

powerSwitchEl.addEventListener("change", (e) => {
  togglePower(e);
});

volumeSliderEl.addEventListener("input", (e) => {
  handleSetVolume(e);
});

muteEl.addEventListener("click", handleMute);

bankBtnEl.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    handleBankSelection(e);
  });
});
// });
