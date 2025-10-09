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
    include: boolean
}

/**
 * Creates a new player.
 * Will fail if incoming player data includes a phone number that is already set on a player.
 */
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

/**
 * Queries for a player by their main attributes (first name, last name, and phone number)
 */
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
        if (query.include) {

        }
        const retrievedPlayer = await prisma.player.findFirst({
            where: q
        });

        return retrievedPlayer;
    } catch (error) {
        throw error;
    }
};

/**
 * Retrieves the matches for the specified player.
 */
const getMatchesForPlayer = async (playerId: number) => {
    try {
        const playerWithMatches = await prisma.player.findUnique({
            where: { id: playerId },
            include: {
                matchesAsPlayer1: true,
                matchesAsPlayer2: true
            }
        });
        
        let allMatches = [];
        
        if (playerWithMatches?.matchesAsPlayer1) {
            allMatches.push(...playerWithMatches.matchesAsPlayer1)
        }
        if (playerWithMatches?.matchesAsPlayer2) {
            allMatches.push(...playerWithMatches.matchesAsPlayer2)
        }   
        return allMatches;
    } catch (error) {
        throw error;
    }
};

//TODO:: implement
const deletePlayer = () => {
    console.log("Will delete player and all their associated match data.")
}

export {
    createPlayer,
    getPlayerByQuery,
    getMatchesForPlayer
}