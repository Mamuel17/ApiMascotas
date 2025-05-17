import { Router } from "express";
import { verifyTokencmzl } from "../controllers/authController_cmzl.js";
import { createRacecmzl, deleteRacecmzl, getRaceByIdcmzl, getRacescmzl, updateRacecmzl } from "../controllers/racesController_cmzl.js";

export const raceRoutercmzl = Router()
raceRoutercmzl.post('/racecmzl',verifyTokencmzl, createRacecmzl )
raceRoutercmzl.get('/racecmzl',verifyTokencmzl, getRacescmzl )
raceRoutercmzl.get('/racecmzl/:id',verifyTokencmzl, getRaceByIdcmzl )
raceRoutercmzl.put('/racecmzl/:id',verifyTokencmzl, updateRacecmzl)
raceRoutercmzl.delete('/racecmzl/:id',verifyTokencmzl, deleteRacecmzl )

