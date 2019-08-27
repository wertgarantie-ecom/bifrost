const request = require('request');

exports.reviewRatings = function getGoogleReviewRating(req, res) {
    request('https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyBTys33uJH7-oByYblJqun7EYOVldzMq5Y&placeid=ChIJ3_c1mbZ0sEcR98FkiQ6jCVo', (error, response, body) => {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body);
    });
};
