import { Router } from "express";
import { sendStatusNotification } from "../services/email.services.js";

export const emailRouter = Router();

emailRouter.post("/email/status/", async (req, res) => {
    sendStatusNotification(req.body);
});