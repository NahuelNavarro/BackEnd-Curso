import { dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from "crypto"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import winston from "winston"
import { transports } from 'winston';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

export default __dirname

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: "587",
    auth: {
        user: "navarronahuelezequiel@gmail.com",
        pass: "weaisaorqlkoqwhm"
    }
});

export const enviarMail = async (to, subject, message) => {
    transporter.sendMail({
        from: "Ecommerce navarronahuelezequiel@gmail.com",
        to, subject, text: message
    })
}

let customLevels = {
    fatal:0,
    error:1,
    warning:2,
    info:3,
    debug:4
}

const customColors = {
    fatal: "bold redBG",
    error: "blue",
    warning: "yellow",
    info: "green",
    debug: "cyan"
};

winston.addColors(customColors);


const devLogger = winston.createLogger({
    levels: customLevels,
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console()
    ]
});

const prodLogger = winston.createLogger({
    levels: customLevels,
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: './logs/errors.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: './logs/combined.log',
            level: 'info'
        })
    ]
});


const SECRET = "CODER123"
//export const generaHash = password => crypto.createHmac("sha256",SECRET).update(password).digest("hex")
export const generaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaPassword = (password, passwordEncriptada) => bcrypt.compareSync(password, passwordEncriptada)
export const middLogger = (req, res, next) => {

    req.logger = logger
    next()
}
export const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;
