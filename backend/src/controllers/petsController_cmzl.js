import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Función para serializar mascotas (incluye conversión de BigInt)
function serializePet(pet) {
    return {
        ...pet,
        User_id: pet.User_id.toString(),
        user: pet.user ? {
            ...pet.user,
            identificacion: pet.user.identificacion.toString()
        } : null
    };
}

export const createPetcmzl = async (req, res) => {
    try {
        const { race_id, category_id, gender_id, User_id, name, estado, latitude, longitude } = req.body;

        // Validación de los campos
        if (isNaN(race_id) || isNaN(category_id) || isNaN(gender_id) || isNaN(User_id)) {
            return res.status(400).json({ msg: "Valores de ID inválidos" });
        }

        // Validar latitud y longitud (si se proporcionan)
        if (latitude && longitude) {
            if (isNaN(latitude) || isNaN(longitude)) {
                return res.status(400).json({ msg: "Latitud o longitud inválidas" });
            }
        }

        // Verifica si el archivo está presente
        const photo = req.file ? req.file.filename : null;

        // Crear la mascota
        const pet = await prisma.pets.create({
            data: {
                race: { connect: { id: Number(race_id) } },
                category: { connect: { id: Number(category_id) } },
                gender: { connect: { id: Number(gender_id) } },
                user: { connect: { identificacion: BigInt(User_id) } },
                name,
                photo,
                estado,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
            },
            include: {
                race: true,
                category: true,
                gender: true,
                user: true
            }
        });

        res.status(201).json({ 
            msg: "Mascota creada exitosamente", 
            pet: serializePet(pet) 
        });

    } catch (error) {
        console.error("Error en createPetcmzl:", error);
        res.status(500).json({ 
            msg: "Error interno del servidor",
            error: error.message 
        });
    }
};

export const getPetscmzl = async (req, res) => {
    try {
        const pets = await prisma.pets.findMany({
            include: {
                race: true,
                category: true,
                gender: true,
                user: true,
            },
        });
        
        res.status(200).json(pets.map(serializePet));
    } catch (error) {
        console.error("Error en getPetscmzl:", error);
        res.status(500).json({ 
            msg: "Error interno del servidor",
            error: error.message 
        });
    }
};

export const getPetByIdcmzl = async (req, res) => {
    try {
        const { id } = req.params;
        const pet = await prisma.pets.findUnique({
            where: { id: Number(id) },
            include: {
                race: true,
                category: true,
                gender: true,
                user: true,
            },
        });
        
        if (pet) {
            res.status(200).json(serializePet(pet));
        } else {
            res.status(404).json({ msg: "Mascota no encontrada" });
        }
    } catch (error) {
        console.error("Error en getPetByIdcmzl:", error);
        res.status(500).json({ 
            msg: "Error interno del servidor",
            error: error.message 
        });
    }
};

export const updatePetcmzl = async (req, res) => {
    try {
        const { id } = req.params;
        const { race_id, category_id, gender_id, User_id, name, photo, estado, latitude, longitude } = req.body;
        
        // Validar latitud y longitud (si se proporcionan)
        if (latitude && longitude) {
            if (isNaN(latitude) || isNaN(longitude)) {
                return res.status(400).json({ msg: "Latitud o longitud inválidas" });
            }
        }

        const pet = await prisma.pets.update({
            where: { id: Number(id) },
            data: {
                race_id: Number(race_id),
                category_id: Number(category_id),
                gender_id: Number(gender_id),
                User_id: BigInt(User_id),
                name,
                photo: req.file ? req.file.filename : photo,
                estado,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
            },
            include: {
                race: true,
                category: true,
                gender: true,
                user: true
            }
        });
        
        res.status(200).json({ 
            msg: "Mascota actualizada exitosamente", 
            pet: serializePet(pet) 
        });
    } catch (error) {
        console.error("Error en updatePetcmzl:", error);
        res.status(500).json({ 
            msg: "Error interno del servidor",
            error: error.message 
        });
    }
};

export const deletePetcmzl = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.pets.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ msg: "Mascota eliminada exitosamente" });
    } catch (error) {
        console.error("Error en deletePetcmzl:", error);
        res.status(500).json({ 
            msg: "Error interno del servidor",
            error: error.message 
        });
    }
};

