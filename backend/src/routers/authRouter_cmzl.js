import { Router } from "express";
import { loginUsercmzl } from "../controllers/authController_cmzl.js";


export const LoginRoutercmzl = Router()
LoginRoutercmzl.post('/logincmzl',loginUsercmzl)