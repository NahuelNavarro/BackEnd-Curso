import { dirname } from 'path';
import {fileURLToPath} from 'url';
import crypto from "crypto"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

export default __dirname

const transporter = nodemailer.createTransport({
    service:"gmail",
    port: "587",
    auth:{
        user:"navarronahuelezequiel@gmail.com",
        pass: "weaisaorqlkoqwhm"
    }
});

export const enviarMail=async(to, subject, message)=>{
    transporter.sendMail({
        from:"Ecommerce navarronahuelezequiel@gmail.com",
        to, subject, text: message
    })
}

const SECRET = "CODER123"
//export const generaHash = password => crypto.createHmac("sha256",SECRET).update(password).digest("hex")
export const generaHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))
export const validaPassword = (password,passwordEncriptada) => bcrypt.compareSync(password,passwordEncriptada)
