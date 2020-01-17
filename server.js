module.exports = function() {
    var express = require('express');
    var path = require('path');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    const searchApi = require('./googleApi');

    var server = express();

    // view engine setup
    server.set('views', path.join(__dirname, 'views'));
    server.set('view engine', 'pug');

    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(cookieParser());
    server.use(express.static(path.join(__dirname, 'public')));


    server.get('/', (req, res) => {
        console.log('index');
        res.render('index.pug', {results: ["Pas de resultats a afficher"]});
    });

    server.get('/search', (request, response) => {
        var searchKeyword = (request.query && 'searchkeyword' in request.query) ? request.query.searchkeyword : null;
        console.log('keyword : ', searchKeyword);
        searchApi.getVideos(searchKeyword).then(function(resp) {
            console.log(resp.results[0].snippet.thumbnails);
            response.render('includes/search-results', {
                results: resp.results
            });
            response.status(resp.error ? 500 : 200);
            response.end();
        }).catch(e => {
            if (e) {
                response.status(500);
                response.end();
            }
        });
    });

    server.listen(3000);
};