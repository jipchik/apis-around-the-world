import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

type MatchType = "SINGLES" | "DOUBLES";

type ParticipantType = "PLAYER" | "TEAM"

type InitializeMatchData = {
    participant1Id: number,
    participant1Type: ParticipantType,
    participant2Id: number,
    participant2Type: ParticipantType,
    matchType: MatchType
};

const initializeMatch = async (matchData: InitializeMatchData) => {
    try {
        const [isValid, reason] = validateMatchData(matchData)
        if (isValid) {
            const createdMatch = await prisma.match.create({
                data: {
                    type: matchData.matchType,
                    matchDate: new Date(),
                    participant1Id: matchData.participant1Id,
                    participant2Id: matchData.participant2Id,
                    participant1Type: matchData.participant1Type,
                    participant2Type: matchData.participant2Type

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

const validateMatchData = (matchData: InitializeMatchData) => {
    const values = Object.values(matchData);
    const entriesHaveValues = values.every(value => value);

    if (!entriesHaveValues) return [false, "Missing required values."];

    if (matchData.participant1Type !== matchData.participant2Type) {
        return [false, "Participant types don't match."];
    }
    if (matchData.matchType === "SINGLES" && matchData.participant1Type === "TEAM") {
        return [false, "Match type does not match participant type format."];
    }
    
    return [true, ""];
};

export {
    initializeMatch
}