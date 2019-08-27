const request = require('request');

exports.reviewRatings = function getGoogleReviewRating(req, res) {
    request('https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyBTys33uJH7-oByYblJqun7EYOVldzMq5Y&placeid=ChIJ3_c1mbZ0sEcR98FkiQ6jCVo', (error, response, body) => {
        var content = JSON.parse(body);
        if (!content.error_message) {
            res.send({
                count: content.result.user_ratings_total,
                rating: content.result.rating,
                url: content.result.url
            });
        } else {
            res.send(body);
        }
    });
};
