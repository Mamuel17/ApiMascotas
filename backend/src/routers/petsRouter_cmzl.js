import { Router } from "express";
import { verifyTokencmzl } from "../controllers/authController_cmzl.js";
import {
  createPetcmzl,
  deletePetcmzl,
  getPetByIdcmzl,
  getPetscmzl,
  updatePetcmzl
} from "../controllers/petsController_cmzl.js";
import { upload } from "../config/multer.js";

export const petRoutercmzl = Router();
petRoutercmzl.post('/petscmzl', upload.single("photo"), verifyTokencmzl, createPetcmzl);
petRoutercmzl.get('/petscmzl', verifyTokencmzl, getPetscmzl);
petRoutercmzl.get('/petscmzl/:id', verifyTokencmzl, getPetByIdcmzl);
petRoutercmzl.post('/petscmzl/update/:id', upload.single("photo"), verifyTokencmzl, updatePetcmzl);
petRoutercmzl.delete('/petscmzl/:id', verifyTokencmzl, deletePetcmzl);
