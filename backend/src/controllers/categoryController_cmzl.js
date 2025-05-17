import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCategorycmzl = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await prisma.categories.create({
            data: { name },
        });
        res.status(201).json({ msg: "Categoría creada con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const getCategoriescmzl = async (req, res) => {
    try {
        const categories = await prisma.categories.findMany();
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const getCategoryByIdcmzl = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await prisma.categories.findUnique({
            where: { id: Number(id) },
        });
        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({ msg: "Categoría no encontrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const updateCategorycmzl = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await prisma.categories.update({
            where: { id: Number(id) },
            data: { name },
        });
        res.status(200).json({ msg: "Categoría actualizada con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const deleteCategorycmzl = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.categories.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ msg: "Categoría eliminada con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};