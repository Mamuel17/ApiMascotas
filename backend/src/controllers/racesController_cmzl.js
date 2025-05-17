import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createRacecmzl = async (req, res) => {
    try {
        const { name } = req.body;
        const race = await prisma.races.create({
            data: { name },
        });
        res.status(200).json({ msg: "Raza creada con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const getRacescmzl = async (req, res) => {
    try {
        const races = await prisma.races.findMany();
        res.status(200).json(races);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const getRaceByIdcmzl = async (req, res) => {
    try {
        const { id } = req.params;
        const race = await prisma.races.findUnique({
            where: { id: Number(id) },
        });
        if (race) {
            res.status(200).json(race);
        } else {
            res.status(404).json({ msg: "Raza no encontrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const updateRacecmzl = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const race = await prisma.races.update({
            where: { id: Number(id) },
            data: { name },
        });
        res.status(200).json({ msg: "Raza actualizada con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const deleteRacecmzl = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.races.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ msg: "Raza eliminada con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};