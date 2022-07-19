'use strict';


const wrapper = document.querySelector('.wrapper');
const musicImg = document.querySelector('.img-area img');
const musicName = wrapper.querySelector('.song-details .name');
const musicArtist = wrapper.querySelector('.song-details .artist');
const playPauseBtn = wrapper.querySelector('.play-pause');
const previousBtn = wrapper.querySelector('#prev');
const nextBtn = wrapper.querySelector('#next');
const mainAudio = wrapper.querySelector('#main-audio');
const progressArea = wrapper.querySelector('.progress-area');
const progressBar = wrapper.querySelector('.progress-bar');
const musicList = wrapper.querySelector('.music-list');
const moreMusicBtn = wrapper.querySelector('#more-music');
const closeMoreMusic = wrapper.querySelector('#close');
const ulMoreList = wrapper.querySelectorAll('ul li');

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
let isMusicPaused = true;

const playingSong = function () {
  const allLiTag = ulTag.querySelectorAll('li');

  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector('.audio-duration');

    if (allLiTag[j].classList.contains('playing')) {
      allLiTag[j].classList.remove('playing');

      let addDuration = audioTag.getAttribute('t-duration');
      audioTag.innerText = addDuration;
    }

    if (allLiTag[j].getAttribute('li-index') == musicIndex) {
      allLiTag[j].classList.add('playing');
      audioTag.innerText = 'Playing';
    }

    allLiTag[j].setAttribute('onclick', 'clicked(this)');
  }
}

console.log(ulMoreList);

const clicked = function (element) {
  // remo0ve first class playing
  // ulMoreList.classList.remove('playing');

  let getLiIndex = element.getAttribute('li-index');
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

const loadMusic = function (indexNum) {
  musicName.innerText = allMusic[indexNum - 1].name;
  musicArtist.innerText = allMusic[indexNum - 1].artist;
  musicImg.src = `images/${allMusic[indexNum - 1].img}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNum - 1].src}.mp3`;
}

const playMusic = function () {
  wrapper.classList.add('paused');
  playPauseBtn.querySelector('i').innerText = 'paused';
  mainAudio.play();
}

const pauseMusic = function () {
  wrapper.classList.remove('paused');
  playPauseBtn.querySelector('i').innerText = 'play_arrow';
  mainAudio.pause();
}

const prevMusic = function () {
  musicIndex--;
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

const nextMusic = function () {
  musicIndex++;
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

// pause the music
playPauseBtn.addEventListener('click', () => {
  const isMusicPlay = wrapper.classList.contains('paused');
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

previousBtn.addEventListener('click', function () {
  prevMusic();
});

nextBtn.addEventListener('click', function () {
  nextMusic();
});

mainAudio.addEventListener('timeupdate', (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;

  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector('.current-time');
  let musicDuration = wrapper.querySelector('.max-duration');

  mainAudio.addEventListener('loadeddata', () => {
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);

    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  // update playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }

  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener('click', (e) => {
  let progressWidth = progressArea.clientWidth; // getting width of prgress bar
  let clickOffsetX = e.offsetX; // getting offset x value
  let songDuration = mainAudio.duration; // getting song total duration

  mainAudio.currentTime = (clickOffsetX / progressWidth) * songDuration;
  playMusic(); // calling playmusic function
  playingSong();
});

// change logo, shuffle, repeat icon onclick
const repeatBtn = wrapper.querySelector('#repeat-plist');

repeatBtn.addEventListener('click', () => {
  let getText = repeatBtn.innerText;

  switch (getText) {
    case 'repeat':
      repeatBtn.innerText = 'repeat_one';
      repeatBtn.setAttribute('title', 'Song looped');
      break;
    case 'repeat_one':
      repeatBtn.innerText = 'shuffle';
      repeatBtn.setAttribute('title', 'Playback Shuffled');
      break;
    case 'shuffle':
      repeatBtn.innerText = 'repeat';
      repeatBtn.setAttribute('title', 'Playlist Looped');
      break;
  }
});

mainAudio.addEventListener('ended', () => {
  let getText = repeatBtn.innerText;

  switch (getText) {
    case 'repeat':
      nextMusic();
      break;
    case 'repeat_one':
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case 'shuffle':
      let randIndex = Math.floor(Math.random() * allMusic.length) + 1;
      do {
        randIndex = Math.floor(Math.random() * allMusic.length) + 1;
      } while (musicIndex == randIndex) {
        musicIndex = randIndex;
        loadMusic(musicIndex);
        playMusic();
        playingSong();
      }
      break;
  }
});

// show music list onclick of music icon
moreMusicBtn.addEventListener('click', () => {
  musicList.classList.toggle('show');
});

closeMoreMusic.addEventListener('click', () => {
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector('ul');
for (let i = 0; i < allMusic.length; i++) {
  let liTag = `
    <li li-index="${i + 1}">
      <div class="row">
        <span>${allMusic[i].name}</span>
        <p>${allMusic[i].artist}</p>
      </div>
      <span id="${allMusic[i].src}" class="audio-duration"></span>
      <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
    </li>
  `;

  ulTag.insertAdjacentHTML('beforeend', liTag);

  let liAudioDurationTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener('loadeddata', () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);

    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }

    liAudioDurationTag.innerText = `${totalMin}:${totalSec}`;
    liAudioDurationTag.setAttribute('t-duration', `${totalMin}: ${totalSec}`);
  });
}

window.addEventListener('load', () => {
  loadMusic(musicIndex);
  playingSong();
});
