const request = require('request');
const postgres = require('../postgres/postgres');
const googleApiKey = process.env.GOOGLE_API_KEY;

exports.reviewRatings = function getGoogleReviewRating(req, res) {
    postgres.query('Select now()', (err, res) => {
        console.log(err);
        console.log(res);
    });

    if (!googleApiKey) {
        console.log("Google API key not set");
        res.send({
            error: "Service currently not available!"
        })
    } else {
        request('https://maps.googleapis.com/maps/api/place/details/json?key=' + googleApiKey + '&placeid=ChIJ3_c1mbZ0sEcR98FkiQ6jCVo', (error, response, body) => {
            var content = JSON.parse(body);
            if (!content.error_message) {
                res.send({
                    text: content.result.user_ratings_total + " Google Reviews",
                    rating: content.result.rating,
                    uri: content.result.url
                });
            } else {
                res.send(body);
            }
        });
    }
};
