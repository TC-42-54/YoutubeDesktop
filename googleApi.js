var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');

const credentials = require('./credentials');

const getVideos = (searchKeyword) => {
    var service = google.youtube({
        version: 'v3',
        auth: credentials
    });
    return new Promise((res, rej) => {
        service.search.list({
            part: 'snippet',
            q: searchKeyword,
            maxResults: 20
        }, (err, apiResults) => {
            console.log(err);
            if (err) {
                console.error(err.message);
                res({
                    error: true,
                    results: []
                });
            }
            var videos = apiResults.data.items.filter(video => {
                return video.id.kind !== "youtube#channel";
            });
            res({
                error: false,
                results: videos
            });
        });
    });
}

module.exports.getVideos = getVideos;