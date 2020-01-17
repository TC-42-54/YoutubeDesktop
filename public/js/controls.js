window.addEventListener('load', function(e) {
    const {ipcRenderer} = require('electron');
    var topBar = document.getElementById('top-bar');
    var videoQuit = document.getElementById('video-quit');
    var controls = document.getElementById('controls');
    var gamingMode = document.getElementById('gaming-mode');
    var showMoreButton = document.getElementById('show-positions');
    var positionButtons = document.getElementsByClassName('position');
    var body = document.getElementsByTagName('body')[0];
    var playPauseButton = document.getElementById('play-pause');
    var volumeRange = document.getElementById('volume-control');
    var volumeContainer = document.getElementById('volume');
    var muteVideo = document.getElementById('volume-mute');

    var timeout;
    window.addEventListener('mousemove', function(e) {
        if (timeout)
            clearTimeout(timeout);
        if (!topBar.classList.contains('hover'))
            topBar.classList.add('hover');
        if (!videoQuit.classList.contains('hover'))
            videoQuit.classList.add('hover');
        if (!controls.classList.contains('hover'))
            controls.classList.add('hover');
        if (!gamingMode.classList.contains('hover'))
            gamingMode.classList.add('hover');      
        timeout = setTimeout(function() {
            topBar.classList.remove('show-more');
            setTimeout(function() {
                topBar.classList.remove('hover');
                videoQuit.classList.remove('hover');
                controls.classList.remove('hover');
                gamingMode.classList.remove('hover');  
            }, 800);
        }, 3000);
    });
    gamingMode.addEventListener('click', function(e) {
        var videoFrame = document.getElementById('video-frame');
        var _this = e.target;
        if (body.classList.contains('gaming-mode')) {
            body.classList.remove('gaming-mode');
            ipcRenderer.send('resizeWindow', window.previousWidth, window.previousHeight);
        } else {
            window.previousWidth = window.innerWidth;
            window.previousHeight = window.innerHeight;
            body.classList.add('gaming-mode');
            ipcRenderer.send('resizeWindow', _this.offsetWidth, _this.offsetHeight);
        }
    });
    videoQuit.addEventListener('click', function(e) {
        this.classList.remove('hover');
        document.dispatchEvent(new Event('video:quit'));
        var playImg = playPauseButton.getElementsByClassName('play')[0];
        var pauseImg = this.getElementsByClassName('pause')[0];
        if (!playImg.classList.contains('hide'))
            playImg.classList.add('hide');
        pauseImg.classList.remove('hide');
    });
    showMoreButton.addEventListener('click', function(e) {
        clearTimeout(timeout);
        if (topBar.classList.contains('show-more')) {
            topBar.classList.remove('show-more')
        } else {
            topBar.classList.add('show-more');
        }
    });
    playPauseButton.addEventListener('click', function(e) {
        var playImg = this.getElementsByClassName('play')[0];
        var pauseImg = this.getElementsByClassName('pause')[0];
        if (!playImg.classList.contains('hide')) {
            playImg.classList.add('hide');
        } else {
            playImg.classList.remove('hide');
        }
        if (!pauseImg.classList.contains('hide')) {
            pauseImg.classList.add('hide');
        } else {
            pauseImg.classList.remove('hide');
        }
        document.dispatchEvent(new Event('video:playpause'));
    });
    Array.from(positionButtons).forEach(positionButton => {
        positionButton.addEventListener('click', function(e) {
            ipcRenderer.send('moveWindow', this.dataset.position);
        });
    });
    volumeRange.addEventListener('input', function(e) {
        var volumeLevel = volumeRange.value;
        var volumeContainer = volumeRange.parentNode;
        var volumeImageMute = document.getElementById('volume-mute');
        var volumeImage25 = document.getElementById('volume-25');
        var volumeImage50 = document.getElementById('volume-50');
        var volumeImage75 = document.getElementById('volume-75');
        var volumeImages = document.getElementsByTagName('img');
        var currentVolumeImage = document.getElementsByClassName('current')[0];
        currentVolumeImage.classList.add('hide');
        currentVolumeImage.classList.remove('current');
        if (volumeLevel == 0) {
            volumeImageMute.classList.add('current');
            volumeImageMute.classList.remove('hide');
        } else if (volumeLevel >= 50 && volumeLevel < 75) {
            volumeImage50.classList.add('current');
            volumeImage50.classList.remove('hide');
        } else if (volumeLevel >= 75) {
            volumeImage75.classList.add('current');
            volumeImage75.classList.remove('hide');
        } else {
            volumeImage25.classList.add('current');
            volumeImage25.classList.remove('hide');
        }
        document.dispatchEvent(new Event('video:volume'));
    });
    volumeContainer.addEventListener('click', function (e) {
        if (e.target.id !== "volume-control") {
            document.dispatchEvent(new Event('video:mute'));
        }
    });
});