import { dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from "crypto"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import winston from "winston"
import { transports } from 'winston';
import jwt from 'jsonwebtoken'
import { error } from 'console';

const PRIVATE_KEY = "CODERKEY"

export const generateToken = (user) => {
    return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '30s' });
}

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({ error: "No está autenticado" });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) {
            if (error.name === 'TokenExpiredError') {
                // Redirige a una página específica si el token ha expirado
                return res.redirect('/api/session/error');
            }
            return res.status(403).send({ error: "No autorizado" });
        }
        req.user = credentials.user;
        next();
    });
};


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

export default __dirname

// Configuración del transporter usando nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587, // 587 es el puerto estándar para SMTP con STARTTLS
    auth: {
        user: "navarronahuelezequiel@gmail.com",
        pass: "weaisaorqlkoqwhm" // Contraseña de aplicación para Gmail
    }
});

// Función para enviar un correo
export const enviarMail = async (to, subject, message) => {
    try {
        await transporter.sendMail({
            from: "Ecommerce <navarronahuelezequiel@gmail.com>", // El nombre del remitente puede ser personalizado
            to,
            subject,
            html: message // Cambiado de 'text' a 'html' para permitir contenido HTML en el cuerpo del correo
        });
        console.log(`Correo enviado a: ${to}`);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

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
export const compararHash = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};
export const validaPassword = (password, passwordEncriptada) => bcrypt.compareSync(password, passwordEncriptada)
export const middLogger = (req, res, next) => {

    req.logger = logger
    next()
}
export const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

