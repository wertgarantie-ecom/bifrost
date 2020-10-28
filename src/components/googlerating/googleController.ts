import {Request, Response} from "express";
import request from "request";
import NodeCache from "node-cache";

/**
 * Google API calls cost money and it's not really important if the results are stale. There for we want to cache them, in memory should be enough for now.
 */
const myCache = new NodeCache({
    stdTTL: 3600
});

const googleApiKey = process.env.GOOGLE_API_KEY;

/**
 * Retrieve googles rating results for wertgarantie.
 * @param req express request
 * @param res express response
 */
export function getGoogleReviewRating(req: Request, res: Response): void {
    if (!googleApiKey) {
        res.send({
            error: "Google API key not set. Service currently not available!"
        });
    } else {
        const googleRatingUri = 'https://maps.googleapis.com/maps/api/place/details/json?key=' + googleApiKey + '&placeid=ChIJ3_c1mbZ0sEcR98FkiQ6jCVo';
        const cachedContent: RatingResponse | undefined = myCache.get(googleRatingUri);
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
}

function sendResponse(res: Response, content: RatingResponse): void {
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

interface RatingResponse {
    error_message: string,
    result: {
        user_ratings_total: number,
        rating: number
    }
}