import { Router } from "express";
const router = Router();

import { sellerSignup, sellerLogin } from "../controllers/sellerAuth.controller.js";


router.post("/signup", sellerSignup);

router.post("/login", sellerLogin);

export default router;