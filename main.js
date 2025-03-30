
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'TanTruc_Player'

let config = JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {};
function setConfig(key, value) {
    config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(config));
}
function loadConfig() {
    isRandom = config.isRandom;
    isLoop = config.isLoop;
    var randomBtn = $('.control_icon-mix')
    var loopBtn = $('.control_icon-loop');
    if (isRandom) {
        randomBtn.classList.add('active_control');
    } else {
        randomBtn.classList.remove('active_control');
    }
    if (isLoop) {
        loopBtn.classList.add('active_control');
    } else {
        loopBtn.classList.remove('active_control');
    }
}
// slider   
var ScollID; // Use this variables when hanlde with slide
var delayTimer; // setTimeout control
function autoScoll() {
    var slider_img = $$('.slider-img');
    var Current = 0;
    var circle_nav = $$('.circle-nav');
    function startInterval3s() {
        ScollID = setInterval(scoll, 5000);
    }
    function stopInterval() {
        clearInterval(ScollID);
    }
    // Check user is there or not
    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === 'hidden') {
            stopInterval();
        } else {
            startInterval3s()
        }
    });
    function circle_select() {
        // Choose nav and scoll to select
        var circle_navs = $$('.circle-nav');
        circle_navs.forEach((nav, index) => {
            nav.onclick = function () {
                slider_img.forEach(img => {
                    img.style.transition = 'ease 1s';
                })
                $('.circle-nav.active-circle').classList.remove('active-circle');
                if (index == 0) {
                    circle_nav[0].classList.add('active-circle');
                    for (var i = 0; i < slider_img.length; i++) {
                        var img_height = slider_img[i].clientHeight;
                        slider_img[i].style.transform = `translateY(-${img_height * 0}px)`
                    }
                } else {
                    circle_nav[index].classList.add('active-circle');
                    for (var i = 0; i < slider_img.length; i++) {
                        var img_height = slider_img[i].clientHeight;
                        slider_img[i].style.transform = `translateY(-${img_height * (index)}px)`
                    }
                }
                Current = index;
                // When user choose, stop 3s and continue loop
                stopInterval();
                startInterval3s();
            }
        }
        )
        $('.circle-nav.active-circle').classList.remove('active-circle');
        if (Current == slider_img.length - 1) {
            circle_nav[0].classList.add('active-circle');
        } else {
            circle_nav[Current].classList.add('active-circle');
        }
    }
    circle_select();
    function scoll() {
        if (Current < slider_img.length - 1) {
            Current++;
            circle_select();
            slider_img.forEach(img => {
                img.style.transition = 'ease 1s';
            })
            for (var i = 0; i < slider_img.length; i++) {
                var img_height = slider_img[i].clientHeight;
                slider_img[i].style.transform = `translateY(-${img_height * Current}px)`
            }
        }
        function scollBack() {
            slider_img.forEach(img => {
                img.style.transform = `translateY(-${img_height * 0}px)`
                img.style.transition = `none`
            })
            Current = 0;
        }
        if (slider_img[Current].classList.contains('first-img')) {
            slider_img[Current].addEventListener('transitionend', function () {
                // if ended img in view;
                var LastImgDistance = img_height * (slider_img.length - 1);
                if (slider_img[Current].style.transform === `translateY(-${LastImgDistance}px)`) {
                    scollBack()
                }
            })

        }
    }
    stopInterval();
    startInterval3s()
}


// Get Artist
function startFetchingArtist() {
    getArtist(renderArist);
}
function getArtist(callback) {
    var path = "https://music-0e8b.onrender.com/Artist"
    fetch(path)
        .then(function (response) {
            return response.json();
        })
        .then(callback)
}

function renderArist(data) {
    var data_box = $('.music_wrapper');
    var htmls = data.map(artist => {
        return `
        <div class="artist_music">
        <div class="music_details">
            <a href="#">
                <img src="${artist.img_url}" alt="" class="music-img">
            </a>
            <div class="music_info">
                <a href="#">
                    <h3 class="music_name-artist" style="margin: 0;">${artist.name}</h3>
                </a>
                <div class="music_sub">
                    <p class="info_follow">${artist.followers} Followers</p>
                    <p class="info_plays">${artist.plays} Plays</p>
                </div>
            </div>
        </div>
        <h2 class="three-dots">...</h2>
    </div>
        `
    })
    data_box.innerHTML = htmls.join('');
}



// Get Songs
function startFetchingSongs() {
    getSongs(renderSongs);
}

function getSongs(callback) {
    var path = "https://music-0e8b.onrender.com/Songs"
    fetch(path)
        .then(function (response) {
            return response.json();
        })
        .then(callback)
}

// Use sort htmls anytime need
var SongsOject = [];
function renderSongs(data) {
    var trending_data_box = $('.trending_songs');
    function handleNumberRank(index) {
        if (index < 9) {
            var number = '0' + (index + 1);
        } else {
            number = index + 1;
        }
        return number
    }
    data.map((item) => {
        var listensString = item.listens.toString();
        var result = "";
        for (var i = 0; i < listensString.length; i++) {
            result += listensString[i];
            if ((i + 1) % 3 === 0 && i !== listensString.length - 1) {
                result += " ";
            }
        }
        listensString = result;
        // get duration song
        var song_url = item.song_url;
        var song = new Audio();
        song.src = song_url;
        song.addEventListener('loadedmetadata', function () {
            var htmlsSong = `
            <div class="song" onclick="getInfoSongs(this)">
                <div class="music_details" >
                    <h2 class="music_rank">01</h2>
                    <img src="${item.img_url}" alt="" class="music-img">
                    <div class="music_info">
                        <h3 class="music_name " style="margin: 0;">${item.name}</h3>
                        <div class="music_sub">
                            <img src="./asset/img/artist-user.png" style="width: 12px; height: 12px; margin-right: 6px;" alt="" class="sub_artist">
                            <p class="music_artist">${item.artist}</p>
                        </div>
                    </div>
                </div>
                <div class="trending_music-sub">
                    <strong class="sub_item">${hanldeSecond(song.duration)}</strong>
                    <span class="sub_item listen" >${listensString}</span>
                    <img src="./asset/img/heart.png" class="sub_item sub_heart">
                    <h3 class="three-dots sub_item" style="font-size: 26px; margin-right:0;">...</h3>
                </div>
            </div>
                `
            var songOject = {
                rank: 'none', // hanlde after sort
                id: item.id,
                listen: item.listens,
                listenString: listensString,
                durationSong: hanldeSecond(song.duration),
                img: item.img_url,
                name: item.name,
                artist: item.artist,
                htmlSong: htmlsSong,
                song_url: item.song_url
            }
            SongsOject.push(songOject);
            if (SongsOject.length === data.length) {
                // sort html
                SongsOject.sort(function (first, second) {
                    if (first.listen > second.listen) {
                        return -1;
                    } else
                        return 0;
                })
                // handle rank
                var number = 1;
                SongsOject.forEach(song => {
                    song.rank = number;
                    number++;
                })
                // fix number
                htmlSong = SongsOject.map((Song, index) => {
                    // convert string to html
                    const parser = new DOMParser();
                    const html = parser.parseFromString(Song.htmlSong, 'text/html');
                    var rankNumber = html.body.querySelector('.music_rank');
                    // fix
                    rankNumber.textContent = handleNumberRank(index)
                    return html.body.innerHTML
                })
                trending_data_box.innerHTML = htmlSong.join('')
                choose();
            }
        });
    })



}
function ActiveSongs() {
    var musicSong = $$('.song');
    musicArray = Array.from(musicSong)
    Active_Element = musicArray.find(song => {
        return song.querySelector('.music_name').textContent == SongsOject[CurrentIndex - 1].name;
    })
    $('.active_song')?.classList.remove('active_song')
    Active_Element.classList.add('active_song')
    ScollToActiveSongs();
}
function ScollToActiveSongs() {
    var activeSong = $('.active_song');
    activeSong.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });

}

function choose() {
    var icons = $$('.content-img');
    var sub_heart = $$('.sub_heart');
    var content_box = $('.content_box');
    icons.forEach((icon) => {
        icon.onclick = function () {
            var active = $('.content-img.active')
            active.classList.remove('active');
            this.classList.add('active');
            // If choose music icon pull home
            var newActive = $('.content-img.active');
            if (newActive === icons[1]) {
                content_box.classList.add('whenPlay')
            }
            // If choose home icon push home
            if (newActive === icons[0]) {
                content_box.classList.remove('whenPlay')
            }
        }
    });

    sub_heart.forEach((icon) => {
        icon.onclick = function () {
            if (this.classList.contains('active_heart')) {
                this.classList.remove('active_heart');
            } else {
                this.classList.add('active_heart');
            }
        }
    });

}


function startFetchingFavourities() {
    getFavourites(renderFavourites);
}
function getFavourites(callback) {
    var path = "https://music-0e8b.onrender.com/Favourites"
    fetch(path)
        .then(function (response) {
            return response.json();
        })
        .then(callback)
}

function renderFavourites(data) {
    var favorites_data_box = $('.favourites_wrapper');
    var htmls = data.map((item, index) => {
        var html_item = `
        <div class="favour_items">
            <img src="${item.img_url}" alt="" class="favour_img">
            <h3 class="favour_heading">${item.name}</h3>
            <p class="favour_sub">${item.sub}</p>
        </div>
         `;
        var newRow;

        if (index % 2 === 0) {
            var newRow = document.createElement('div');
            newRow.classList.add('favourites_row');
            var parser = new DOMParser();
            var doc = parser.parseFromString(html_item, 'text/html');
            var itemElement = doc.body.querySelector('div');
            newRow.appendChild(itemElement);
            return newRow;
        }
    })
    // 
    data.map((item, index) => {
        var html_item = `
        <div class="favour_items">
            <img src="${item.img_url}" alt="" class="favour_img">
            <h3 class="favour_heading">${item.name}</h3>
            <p class="favour_sub">${item.sub}</p>
        </div>
         `;
        if (index % 2 != 0) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html_item, 'text/html');
            var itemElement = doc.body.querySelector('div');
            htmls[index - 1].appendChild(itemElement);
        }

    })

    // remove unifined elements
    var filteredArray = htmls.filter(function (element) {
        return element !== undefined;
    });

    filteredArray.forEach(html => {
        favorites_data_box.appendChild(html);
    })
}

// Handle when plays
var CurrentIndex = 0;

function getInfoSongs(Song) {
    songOject = SongsOject.find(song => song.name == Song.querySelector('.music_name').textContent)
    var infoOject = {
        rank: songOject.rank,
        id: songOject.id,
        name: songOject.name,
        artist: songOject.artist,
        img: songOject.img_url
    }
    // handle if user click threedots or heart, dont load music 
    var heart = $$('.sub_heart');
    var threeDots = $$('.three-dots');
    var playlist = $('.trending_songs');
    playlist.onclick = function (e) {
        if (!Array.from(heart).includes(e.target) && !Array.from(threeDots).includes(e.target)) {
            LoadSong(infoOject.rank);
        }
    }


}
const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#4F4A85',
    progressColor: '#383351',
    barWidth: 4,
    reponsive: true,
    height: 15,
    url: "./asset/songs/tiptoe_mp3.mp3",
    barRadius: 10,
    waveColor: [
        "#6b697e"
    ],
    progressColor: [
        "white"
    ]
})
function hanldeSecond(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return minutes + ":" + remainingSeconds;
}
var playedSong = [];
var RankCurrentSong = 0;
function LoadSong(RankNumber) {
    var content_box = $('.content_box');
    var img = $('.music_box-img');
    var name = $('.heading_name');
    var artist = $('.heading_artist');
    var audio = $('#audio');
    var end_duration = $$('.end_duration');
    var songOject = SongsOject.find(song => song.rank === RankNumber);
    // Pull home content
    content_box.classList.add('whenPlay');
    // active music icon
    var icons = $$('.content-img');
    var active = $('.content-img.active')
    active.classList.remove('active');
    icons[1].classList.add('active');
    // handle info music box


    // if current song is current song => dont load song
    if (RankCurrentSong != RankNumber) {
        // remove playing
        var playbtn = $('.main_play');
        playbtn.classList.remove('playing')
        // Render to UI
        playedSong.push(parseInt(songOject.rank));
        img.src = songOject.img;
        name.textContent = songOject.name;
        artist.textContent = songOject.artist;
        audio.src = songOject.song_url
        CurrentIndex = songOject.rank;
        wavesurfer.load(`${songOject.song_url}`)
        wavesurfer.on('ready', function () {
            duration = wavesurfer.getDuration();
            end_duration.forEach(item => item.textContent = hanldeSecond(duration));
        });
        RankCurrentSong = RankNumber;
    }
    Play();
    ResetPlayed();
    ActiveSongs();
}

function nextSong() {
    var nextBtn = $('.main_next');
    nextBtn.onclick = function () {
        if (isRandom) {
            PlayRandomSong()
        } else {
            if (CurrentIndex >= SongsOject.length) {
                CurrentIndex = 1;
                LoadSong(CurrentIndex)
            } else {
                CurrentIndex++;
                LoadSong(CurrentIndex);
            }
        }
    }
}
function prevSong() {
    var preBtn = $('.main_pre');
    preBtn.onclick = function () {
        if (isRandom) {
            PlayRandomSong();
        } else {
            if (CurrentIndex <= 1) {
                CurrentIndex = SongsOject.length + 1;
            } else {
                CurrentIndex--;
                LoadSong(CurrentIndex);
            }
        }


    }
}
// Check isRandom
var isRandom = false;
var isLoop = false;
function ControlSong() {
    var randomBtn = $('.control_icon-mix')
    var loopBtn = $('.control_icon-loop');
    var controlBtn = $$('.auto-control');
    controlBtn.forEach(btn => {
        btn.onclick = function () {
            isRandom = false;
            isLoop = false;
            // remove all icon active
            var active = $('.active_control');
            active?.classList.remove('active_control');

            if (btn == randomBtn) {
                if (btn == active) {
                    active.classList.remove('active_control');
                    isRandom = false;

                } else
                    if (btn.classList.contains('active_control')) {
                        btn.classList.remove('active_control');
                        isRandom = false
                    } else {
                        btn.classList.add('active_control');
                        isRandom = true;
                    }
            } else if (btn == loopBtn) {
                if (btn == active) {
                    active.classList.remove('active_control');
                    isLoop = false;
                } else
                    if (btn.classList.contains('active_control')) {
                        btn.classList.remove('active_control');
                        isRandom = false
                    } else {
                        btn.classList.add('active_control');
                        isLoop = true;
                    }
            }
            setConfig('isRandom', isRandom);
            setConfig('isLoop', isLoop);
        }

    })
}
function ResetPlayed() {
    var flag = true;
    for (var i = 1; i < SongsOject.length + 1; i++) {
        if (!playedSong.includes(i)) {
            flag = false;
            break;
        }
    }
    if (flag) {
        playedSong = []
    }
}
function PlayRandomSong() {
    function IsPlayed() {
        var flag = false;
        for (var i = 0; i < playedSong.length; i++) {
            if (playedSong[i] === newIndex) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * SongsOject.length + 1)
    } while (newIndex === CurrentIndex || IsPlayed());
    LoadSong(newIndex);
}

function getIndexSong(index, callback) {
    var Song_oject;
    getSongs(data => {
        Song_oject = data.find(song => song.id === index)
        callback(Song_oject)
    })
}

var isPlay = false;
function Play() {
    var btn = $('.main_play');
    isPlay = true;
    btn.classList.add('playing')
    audio.play();
    wavesurfer.play()
    wavesurfer.setMuted(true)
}
function playBtn() {
    var playBox = $('.play_box');
    var btn = $('.main_play');
    playBox.onclick = function () {
        if (isPlay) {
            isPlay = false;
            btn.classList.remove('playing')
            wavesurfer.pause()
            audio.pause();
        } else {
            isPlay = true;
            btn.classList.add('playing')
            audio.play();
            wavesurfer.play()

            wavesurfer.setMuted(true)
        }
    }
    // When songs finish
    audio.onended = function () {
        // Remove playing
        var nextBtn = $('.main_next');
        isPlay = false;
        btn.classList.remove('playing')
        // if ended song => Next Song or Loop Song
        if (isLoop) {
            Play();
        } else {
            nextBtn.click()
        }
    }
}

function progressSong() {
    var progressBar = $('.progress');
    var current_duration = $$('.current_duration');
    var lastTime = 0;
    audio.ontimeupdate = function () {
        var progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progressPercent.toFixed(2);
        wavesurfer.setTime(audio.currentTime)
        // Update Current Time
        var currentTime = Math.floor(audio.currentTime);
        if (lastTime !== currentTime) {
            lastTime = currentTime;
            current_duration.forEach(item => item.textContent = hanldeSecond(currentTime));
        }
    }


    // Jump progress Song (Progress to wave)
    progressBar.oninput = function (e) {
        const seekTime = audio.duration * e.target.value / 100;
        audio.currentTime = seekTime;
        wavesurfer.setTime(seekTime);
    }
    // Jump progress Song (wave to Progress)
    wavesurfer.on('click', function () {
        const waveTime = wavesurfer.getCurrentTime();
        audio.currentTime = waveTime;
    })

}

function switchProgress() {
    var switch_check = $('.switch_check');
    var info_progress = $('.info_progress');
    var wave = $('.wave');
    if (switch_check.checked) {
        info_progress.style.display = 'none';
        wave.style.display = 'flex'
    } else {
        wave.style.display = 'none'
        info_progress.style.display = 'block';
    }
    playBtn();
}
function VolumeControl() {

    // Lấy phần tử volume_img
    const volumeImg = document.querySelector('.volume_wrapper');

    // Lấy phần tử volume
    const volume = document.getElementById('volume');

    // Sử dụng sự kiện mouseover và mouseout để hiển thị và ẩn phần tử volume khi hover
    volumeImg.addEventListener('mouseover', function () {
        volume.style.display = 'block';
    });

    volumeImg.addEventListener('mouseout', function () {
        volume.style.display = 'none';
    });
    var audio = $('#audio');
    var volume_range = $('.volume');
    audio.volume = volume_range.value / 100;
    volume_range.oninput = function (e) {
        audio.volume = e.target.value / 100;
    }

}
function addBefore() {
    var background = $('.content_wrapper');
    var beforeElement = document.createElement('div');
    beforeElement.classList.add('before');
    background.insertBefore(beforeElement, background.firstChild)
    setInterval(randomPosition, 4000);
}
function randomPosition() {
    var beforeElement = $('.before')
    var topE = Math.floor(Math.random() * 500);
    var leftE = Math.floor(Math.random() * 400);
    beforeElement.style.top = `${topE}px`
    beforeElement.style.left = `${leftE}px`
}

function startApp() {
    loadConfig();
    autoScoll();
    startFetchingArtist();
    startFetchingFavourities();
    startFetchingSongs();
    progressSong();
    playBtn();
    nextSong()
    prevSong();
    ControlSong();
    VolumeControl();
    addBefore();
}

startApp();
