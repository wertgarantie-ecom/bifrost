const request = require('request');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache({
    stdTTL: 3600
});

const googleApiKey = process.env.GOOGLE_API_KEY;

exports.reviewRatings = function getGoogleReviewRating(req, res) {
    if (!googleApiKey) {
        console.log("Google API key not set");
        res.send({
            error: "Service currently not available!"
        });
    } else {
        const googleRatingUri = 'https://maps.googleapis.com/maps/api/place/details/json?key=' + googleApiKey + '&placeid=ChIJ3_c1mbZ0sEcR98FkiQ6jCVo';
        const cachedContent = myCache.get(googleRatingUri);
        if (cachedContent) {
            console.log("send cached content")
            sendResponse(res, cachedContent);
        } else {
            request(googleRatingUri, (error, response, body) => {
                var content = JSON.parse(body);
                myCache.set(googleRatingUri, content);
                console.log("send fetched content from google")
                sendResponse(res, content);
            });
        }
    }
};

function sendResponse(res, content) {
    if (!content.error_message) {
        res.send({
            text: content.result.user_ratings_total + " Google Reviews",
            rating: content.result.rating,
            uri: content.result.url
        });
    } else {
        res.send(content);
    }
}