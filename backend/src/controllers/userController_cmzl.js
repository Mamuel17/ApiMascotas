import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUsercmzl = async (req, res) => {
    try {
        const { identificacion, fullname, email, password, rol } = req.body;

        if (!password) {
            return res.status(400).json({ msg: "La contraseña es requerida" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                identificacion,
                fullname,
                email,
                password: hashedPassword,
                rol
            }
        });

        res.status(200).json({ msg: "Usuario creado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const getUsercmzl = async (req, res) => {
    try {
        const users = await prisma.users.findMany();
        const usersResponse = users.map(user => ({
            ...user,
            identificacion: user.identificacion.toString(),
        }));

        if (users.length > 0) {
            res.status(200).json(usersResponse);
        } else {
            res.status(400).json({ msg: "Error al obtener usuarios" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const getUserByIdcmzl = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.users.findUnique({
            where: { identificacion: Number(id) },
        });

        if (user) {
            res.status(200).json({
                ...user,
                identificacion: user.identificacion.toString(),
            });
        } else {
            res.status(404).json({ msg: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const updateUsercmzl = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname, email, password, rol } = req.body;
        let updatedData = { fullname, email, rol };
        if (password) {
            updatedData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.users.update({
            where: { identificacion: Number(id) },
            data: updatedData,
        });

        if (user) {
            res.status(200).json({ msg: "Usuario actualizado exitosamente" });
        } else {
            res.status(400).json({ msg: "Error al actualizar usuario" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const deleteUsercmzl = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.users.delete({
            where: { identificacion: Number(id) },
        });
        res.json({ message: "Usuario eliminado exitosamente" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};