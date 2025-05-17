import { Router } from "express";
import { verifyTokencmzl } from "../controllers/authController_cmzl.js";
import { createCategorycmzl, deleteCategorycmzl, getCategoriescmzl, getCategoryByIdcmzl, updateCategorycmzl } from "../controllers/categoryController_cmzl.js";

export const categoryRoutercmzl = Router()
categoryRoutercmzl.post('/categorycmzl',verifyTokencmzl,createCategorycmzl )
categoryRoutercmzl.get('/categorycmzl',verifyTokencmzl, getCategoriescmzl )
categoryRoutercmzl.get('/categorycmzl/:id',verifyTokencmzl, getCategoryByIdcmzl )
categoryRoutercmzl.put('/categorycmzl/:id',verifyTokencmzl, updateCategorycmzl )
categoryRoutercmzl.delete('/categorycmzl/:id',verifyTokencmzl, deleteCategorycmzl )

