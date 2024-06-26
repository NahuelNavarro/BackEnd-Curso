import { Router } from "express";

import { createOrder } from "../controllers/ordenes.js";

export const router = Router();

router.post('/', createOrder);


