import mongoose from "mongoose";
import { config } from "../config/config.js";

export const dbConnection = async() => {
    try {
        await mongoose.connect(config.MONGO_URL,{dbName: config.DB_NAME});
        console.log(`Conectado a la base de datos ${config.DB_NAME}`)
    } catch (error) {
        console.log(`Error al levantar la base de datos ${error}`)
        process.exit(1);
    }
}