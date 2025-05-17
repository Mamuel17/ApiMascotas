import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import dotenv from 'dotenv';
import cors from 'cors';

import { UserRoutercmzl } from './src/routers/userRouter_cmzl.js';
import { LoginRoutercmzl } from './src/routers/authRouter_cmzl.js';
import { genderRoutercmzl } from './src/routers/gendersRouter_cmzl.js';
import { categoryRoutercmzl } from './src/routers/categoryRouter_cmzl.js';
import { petRoutercmzl } from './src/routers/petsRouter_cmzl.js';
import { raceRoutercmzl } from './src/routers/raceRouter_cmzl.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta de imágenes
app.use('/images', express.static('images'));  

// Cargar la documentación Swagger
const swaggerDocument = YAML.load('./src/docs/swagger.yaml');
app.use('/document', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routers
app.use(UserRoutercmzl);
app.use(LoginRoutercmzl);
app.use(genderRoutercmzl);
app.use(categoryRoutercmzl);
app.use(petRoutercmzl);
app.use(raceRoutercmzl);

// Iniciar servidor
app.listen(3000, '0.0.0.0', () => {
    console.log(`Servidor iniciado en http:// 192.168.1.5:3000`);

});
