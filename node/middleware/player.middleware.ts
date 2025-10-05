import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

type CreatePlayerData = {
    firstName: string,
    lastName: string,
    phoneNumber: string
}

type GetPlayerQueryData = {
    firstName?: string,
    lastName?: string,
    phoneNumber?: string
}

const createPlayer = async (playerData: CreatePlayerData) => {
    try {
        const newPlayer = await prisma.player.create({
        data: {
            firstName: playerData?.firstName,
            lastName: playerData?.lastName,
            phoneNumber: playerData?.phoneNumber
        }
        });
        return newPlayer;
    } catch (error) {
        throw error;
    }
}

const getPlayerByQuery = async (query: GetPlayerQueryData) => {
    try {
        let q = {};
        if (query.firstName && query.firstName !== "") {
            q = {...q, firstName: query.firstName}
        }
        if (query.lastName && query.lastName !== "") {
            q = {...q, lastName: query.lastName}
        }
        if (query.phoneNumber && query.phoneNumber !== "") {
            q = {...q, phoneNumber: query.phoneNumber}
        }
        const retrievedPlayer = await prisma.player.findFirst({
            where: q
        });

        return retrievedPlayer;
    } catch (error) {
        throw error;
    }
};

export {
    createPlayer,
    getPlayerByQuery
}