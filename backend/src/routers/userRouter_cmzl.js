import { Router } from "express";
import { verifyTokencmzl } from "../controllers/authController_cmzl.js";
import { createUsercmzl, deleteUsercmzl, getUserByIdcmzl, getUsercmzl, updateUsercmzl } from "../controllers/userController_cmzl.js";


export const UserRoutercmzl = Router()
UserRoutercmzl.post('/userscmzl',createUsercmzl )
UserRoutercmzl.get('/userscmzl', getUsercmzl )
UserRoutercmzl.get('/userscmzl/:id',verifyTokencmzl, getUserByIdcmzl )
UserRoutercmzl.put('/userscmzl/:id',verifyTokencmzl, updateUsercmzl )
UserRoutercmzl.delete('/userscmzl/:id',verifyTokencmzl, deleteUsercmzl )

