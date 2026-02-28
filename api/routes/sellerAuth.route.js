import { Router } from "express";
const router = Router();

import { sellerSignup, sellerLogin,sellerLogout } from "../controllers/sellerAuth.controller.js";


router.post("/signup", sellerSignup);

router.post("/login", sellerLogin);

router.post("/logout", sellerLogout);

export default router;