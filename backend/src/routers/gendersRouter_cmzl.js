import { Router } from "express";
import { verifyTokencmzl } from "../controllers/authController_cmzl.js";
import { createGendercmzl, deleteGendercmzl, getGenderByIdcmzl, getGenderscmzl, updateGendercmzl } from "../controllers/gendersController_cmzl.js";


export const genderRoutercmzl = Router()
genderRoutercmzl.post('/gendercmzl',verifyTokencmzl, createGendercmzl )
genderRoutercmzl.get('/gendercmzl',verifyTokencmzl, getGenderscmzl )
genderRoutercmzl.get('/gendercmzl/:id',verifyTokencmzl, getGenderByIdcmzl )
genderRoutercmzl.put('/gendercmzl/:id',verifyTokencmzl, updateGendercmzl)
genderRoutercmzl.delete('/gendercmzl/:id',verifyTokencmzl, deleteGendercmzl )

