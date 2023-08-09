let musics = [
  {
    name: "rihannah",
    cover: "imgs/rihanna.jpg",
    audio: new Audio("./musics/Rihanna.mp3"),
  },
  {
    name: "selena",
    cover: "imgs/selena.jpg",
    audio: new Audio("./musics/Selena.mp3"),
  },
  {
    name: "Adel",
    cover: "imgs/adel.jpg",
    audio: new Audio("./musics/Adel.mp3"),
  },
];

let range = document.querySelector("#music-time");
let PlayBtn = document.querySelector("#play-btn");
let nextBtn = document.querySelector("#next-btn");
let preBtn = document.querySelector("#pre-btn");
let musicName = document.querySelector("#music-name");
let musicCover = document.querySelector("#music-cover");
let currentMusic = 0;

let audio = musics[currentMusic].audio;
musicCover.src = musics[currentMusic].cover;
musicName.innerText = musics[currentMusic].name;

audio.addEventListener("canplay", () => {
  range.max = audio.duration;
});

audio.addEventListener("timeupdate", () => {
  range.value = audio.currentTime;
});
range.addEventListener("input", () => {
  audio.currentTime = range.value;
});

PlayBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();

    musicCover.style.animationPlayState = "running";
    PlayBtn.classList.replace("fa-play", "fa-pause");
  } else {
    audio.pause();

    musicCover.style.animationPlayState = "paused";
    PlayBtn.classList.replace("fa-pause", "fa-play");
  }
});

nextBtn.addEventListener("click", () => {
  changeMusic("next");
});

preBtn.addEventListener("click", () => {
  changeMusic("pre");
});

function changeMusic(state) {
  audio.pause();
  range.value = 0;
  PlayBtn.classList.replace("fa-pause", "fa-play");
  musicCover.style.animationPlayState = "paused";
  audio.currentTime = 0;
  if (state == "next") {
    if (currentMusic == musics.length - 1)
      currentMusic = 0;
    else currentMusic += 1;
  } else {
    if (currentMusic == 0) currentMusic = musics.length - 1;
    else currentMusic -= 1;
  }
  audio = musics[currentMusic].audio;
  musicCover.src = musics[currentMusic].cover;
  musicName.innerText = musics[currentMusic].name;
  
  audio.addEventListener("timeupdate", () => {
    range.value = audio.currentTime;
  });
}
