import { Router } from "express";
import {
  createCountry,
  deleteCountry,
  getCountryList,
  getCountryLookupList,
  getCountryModel,
  updateCountry,
} from "../controllers/country.controller.js";

const router = Router();

router.get("/GetList", getCountryList);
router.get("/GetLookupList", getCountryLookupList);
router.get("/GetModel/:id", getCountryModel);
router.post("/Insert", createCountry);
router.put("/Update/:id", updateCountry);
router.delete("/Delete/:id", deleteCountry);

export default router;
