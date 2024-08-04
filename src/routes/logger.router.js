import { Router } from "express";

//import { createOrder } from "../controllers/ordenes.js";

export const router = Router();


router.get('/', async (req, res) => {
    req.logger.fatal("prueba log fatal")
    req.logger.error("prueba log error")
    req.logger.warning("prueba log warning")
    req.logger.info("prueba log info")
    req.logger.debug("prueba log debug")

})