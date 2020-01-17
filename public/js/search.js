window.addEventListener('load', function(e) {
    const {ipcRenderer} = require('electron');
    var ajaxRequest = (url, searchKeyword) => {
        return new Promise((res, rej) => {
            var oReq = new XMLHttpRequest();
            oReq.onload = function (e) {
                res(document.createRange().createContextualFragment(e.target.response));
            };
            oReq.open('GET', url + '?searchkeyword=' + searchKeyword, true);
            oReq.send();
            
        });
    }
    var searchInput = document.getElementById('search-input');
    var searchTimeout = null;
    var doSearch = function() {
        var searchResultsContainer = document.getElementsByClassName('search-results-container');
        var inputValue = this.value;
        var url = this.dataset.url;
        if (inputValue) {
            ajaxRequest(url, inputValue).then(response => {
                if (searchResultsContainer.length && response) {
                    searchResultsContainer[0].innerHTML = response.getElementById('search-results').outerHTML;
                    initVideoEvents();
                }
            });
        }
    };

    var onPlayerReady = function(e) {
        var videoFrame = document.getElementById('video-frame');
        var body = document.getElementsByTagName('body')[0];
        videoFrame.parentNode.classList.remove('hide');
        body.className = 'player-active';
        e.target.setPlaybackQuality('default');
        ipcRenderer.send('resizeWindow', videoFrame.offsetWidth, videoFrame.offsetHeight);
    };
    var onPlayerStateChange = function(e) {
        if (e == 0) {
            var videoFrame = document.getElementById('video-frame');
            var videoFrameContainer = videoFrame.parentNode;
            var body = document.getElementsByTagName('body')[0];
            var searchContainer = document.getElementById('search-container');
            body.className = '';
            if (!videoFrame.parentNode.classList.contains('hide'))
                videoFrame.parentNode.classList.add('hide');
            videoFrame.remove();
            videoFrame = document.createElement('div');
            videoFrame.id = 'video-frame';
            videoFrameContainer.append(videoFrame);
            ipcRenderer.send('resizeWindow', searchContainer.offsetWidth, 600);
        }
    }
    var initVideoEvents = () => {
        var videos = document.getElementsByClassName('video-result');
        Array.from(videos, video => video.addEventListener('click', function(e) {
            var videoFrame = document.getElementById('video-frame');
            var baseUrl = videoFrame.dataset.baseSrc;
            var player = new YT.Player(videoFrame, {
                width: '640',
                height: '360',
                playerVars: {
                    'autoplay': 1,
                    'showinfo': 0,
                    'rel': 0,
                    'cc_load_policy': 1,
                    'iv_load_policy': 1,
                    'theme': 'light',
                    'fs': 0,
                    'color': 'white',
                    'controls': 0,
                    'disabledkb': 1

                },
                videoId: video.id,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
            document.addEventListener('video:quit', function(e) {
                if (player) {
                    onPlayerStateChange(0);
                }
            });
            document.addEventListener('video:playpause', function(e) {
                if (player) {
                    if (player.getPlayerState() === 1) {
                        player.pauseVideo();
                    } else {
                        player.playVideo();
                    }
                }
            });
            document.addEventListener('video:volume', function(e) {
                var volumeRange = document.getElementById('volume-control');
                if (player && !isNaN(volumeRange.value)) {
                    player.unMute();
                    player.setVolume(volumeRange.value);
                }
            });
            document.addEventListener('video:mute', function(e) {
                debugger;
                var volumeImageMute = document.getElementById('volume-mute');
                var currentVolumeImage = document.getElementsByClassName('current')[0];
                var volumeRange = document.getElementById('volume-control');
                

                if (player) {
                    if (player.isMuted()) {
                        player.unMute();
                        volumeRange.dispatchEvent(new Event('input', {
                            bubbles: true,
                            cancelable: true,
                        }));
                    } else {
                        player.mute();
                        currentVolumeImage.classList.add('hide');
                        currentVolumeImage.classList.remove('current');
                        volumeImageMute.classList.add('current');
                        volumeImageMute.classList.remove('hide');
                    }
                }
            });
        }));
    }
    searchInput.addEventListener('change', function(e) {
        if (searchTimeout) clearTimeout(searchTimeout);
        if (searchInput.value) {
            searchTimeout = setTimeout(function() {
                doSearch.apply(searchInput);
            }, 1000);
        }
    });
    
});