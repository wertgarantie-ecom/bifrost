import expressWinston from 'express-winston';
import winston from 'winston';

export default function setUpAccessLogger() {
    const stage = process.env.NODE_ENV;
    const format = (stage === 'local' || stage === 'dockerlocal') ? winston.format.simple() : winston.format.json();
    return expressWinston.logger({
        transports: [
            new winston.transports.Console()
        ],
        format: winston.format.combine(
            winston.format.colorize(),
            format
        ),
        requestWhitelist: [...expressWinston.requestWhitelist, "body"],
        expressFormat: true,
        colorize: true,
    })
}