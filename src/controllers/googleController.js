const request = require('request');
const NodeCache = require("node-cache");
const myCache = new NodeCache({
    stdTTL: 3600
});

const googleApiKey = process.env.GOOGLE_API_KEY;

exports.reviewRatings = function getGoogleReviewRating(req, res) {
    if (!googleApiKey) {
        res.send({
            error: "Google API key not set. Service currently not available!"
        });
    } else {
        const googleRatingUri = 'https://maps.googleapis.com/maps/api/place/details/json?key=' + googleApiKey + '&placeid=ChIJ3_c1mbZ0sEcR98FkiQ6jCVo';
        const cachedContent = myCache.get(googleRatingUri);
        if (cachedContent) {
            sendResponse(res, cachedContent);
        } else {
            request(googleRatingUri, (error, response, body) => {
                var content = JSON.parse(body);
                myCache.set(googleRatingUri, content);
                sendResponse(res, content);
            });
        }
    }
};

function sendResponse(res, content) {
    if (!content.error_message) {
        res.send({
            ratingsTotal: content.result.user_ratings_total,
            text: "Google Reviews",
            rating: content.result.rating,
            uri: "https://www.google.com/maps/place/WERTGARANTIE+AG/@52.3691835,9.7394476,17z/data=!3m1!4b1!4m7!3m6!1s0x0:0x5a09a30e8964c1f7!8m2!3d52.3691835!4d9.7416363!9m1!1b1"
        });
    } else {
        res.send(content);
    }
}