import { Router } from "express";
import {
  forgotPassword,
  getSignupLocationLookups,
  login,
  signup,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/Signup", signup);
router.post("/Login", login);
router.post("/ForgotPassword", forgotPassword);
router.get("/LocationLookups", getSignupLocationLookups);

export default router;
