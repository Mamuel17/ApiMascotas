import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createGendercmzl = async (req, res) => {
    try {
        const { name } = req.body;
        const gender = await prisma.genders.create({
            data: { name },
        });
        res.status(201).json({ msg: "Género creado con éxito", gender });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const getGenderscmzl = async (req, res) => {
    try {
        const genders = await prisma.genders.findMany();
        res.status(200).json(genders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const getGenderByIdcmzl = async (req, res) => {
    try {
        const { id } = req.params;
        const gender = await prisma.genders.findUnique({
            where: { id: Number(id) },
        });
        if (gender) {
            res.status(200).json(gender);
        } else {
            res.status(404).json({ msg: "Género no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const updateGendercmzl = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const gender = await prisma.genders.update({
            where: { id: Number(id) },
            data: { name },
        });
        res.status(200).json({ msg: "Género actualizado con éxito", gender });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const deleteGendercmzl = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.genders.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ msg: "Género eliminado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};