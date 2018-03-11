var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

var _cacheBody = null;

router.get('/frequency/:number', function (req, res, next) {

    const number = req.params.number;

    if (_cacheBody === null) {
        request.get('http://terriblytinytales.com/test.txt', function (error, response, body) {
            if (!error && response.statusCode === 200) {
                _cacheBody = body;
                res.send(getTopNList(_cacheBody, number))
            }
        });
    }
    else {
        res.send(getTopNList(_cacheBody, number))
    }
});

function getTopNList(text, topN) {
    var list = {};
    const words = text.split(" ");

    words.forEach(function (t) {
        if (list[t] === undefined) {
            list[t] = 0;
        }
        list[t]++;
    });

    var sortedWords = Object.keys(list).sort(function (a, b) {
        return list[b] - list[a]
    });

    var sortedList = [];

    sortedWords.slice(0, topN).forEach(function (t) {
        var count = list[t];
        sortedList.push({"word": t, "frequency": count})
    })

    return sortedList;
}


module.exports = router;
