import { match } from "assert";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

type MatchType = "SINGLES" | "DOUBLES";

type MatchData = {
    player1Id?: number,
    player2Id?: number,
    team1Id?: number,
    team2Id?: number,
    matchType: MatchType,
    winnerId?: number,
    finalScore?: string,

};

const initializeMatch = async (matchData: MatchData) => {
    try {
        const [isValid, reason] = validateMatchData(matchData);
        if (isValid) {
            const createdMatch = await prisma.match.create({
                data: {
                    type: matchData.matchType,
                    ...(matchData.matchType === 'SINGLES' && {
                        player1Id: matchData.player1Id,
                        player2Id: matchData.player2Id
                    }),
                    ...(matchData.matchType === 'DOUBLES' && {
                        team1Id: matchData.team1Id,
                        team2Id: matchData.team2Id
                    })
                }
            });
            return createdMatch;
        } else {
            return reason;
        }

    } catch (error) {
        throw error;
    }
};

const finalizeMatch = async (id: number, updateData: MatchData) => {
    let updatedMatch = null;
    try {
        const match = await prisma.match.findUnique({where: {id: id}});

        if (match && match.status !== "COMPLETE") {
            const matchStartTime = new Date(match.createdAt).getTime();
            const now = Date.now();

            const duration = now - matchStartTime;
            updatedMatch = await prisma.match.update({
                data: {
                    durationInMs: duration,
                    status: "COMPLETE",
                    winnerId: updateData.winnerId,
                    finalScore: updateData.finalScore
                },
                where: {
                    id: match.id
                }
            });
        }
        return updatedMatch;
    } catch (error) {
        throw error;
    }
};

const validateMatchData = (matchData: MatchData) => {
    const values = Object.values(matchData);
    const entriesHaveValues = values.every(value => value);

    if (!entriesHaveValues) return [false, "Missing required values."];

    if (matchData.matchType === "DOUBLES" && !matchData.team1Id && !matchData.team2Id) {
        return [false, "Doubles matches require team data."];
    }
    if (matchData.matchType === "SINGLES" && !matchData.player1Id && !matchData.player2Id) {
        return [false, "Singles matches require player data."];
    }
    
    return [true, ""];
};

export {
    initializeMatch,
    finalizeMatch
}