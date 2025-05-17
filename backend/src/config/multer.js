import multer from 'multer';
import path from 'path';

// Configuración del almacenamiento 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images'); // Todas las fotos que se registren van a esta carpeta
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});

// Filtro de tipos de archivo (permitir imágenes JPEG, JPG, PNG y SVG)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes JPEG, JPG, PNG y SVG'), false);
  }
};

// Límite de tamaño: sin límite
export const upload = multer({
  storage,
  fileFilter
});
