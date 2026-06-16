import express from "express";
import { googleCallback, googleRedirect } from "../controllers/authControllers/googleAuth.js";

const Router = express.Router();

Router.get("/google", googleRedirect);
Router.get("/google/callback", googleCallback);

export default Router;
