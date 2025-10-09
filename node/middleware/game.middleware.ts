import { PrismaClient } from "../generated/prisma";

import { finalizeMatch } from "./match.middleware";

const prisma = new PrismaClient();

type Point = {
    gameScoreBefore: string,
    gameScoreAfter: string | null,
    winnerId: number
};

type GameData = {
    startTime: string,
    numberOfAdvantages: number,
    winnerId: number,
    serverId: number,
    gameCompletesSet: Boolean,
    gameCompletesMatch: Boolean,
    finalSetScore?: string,
    tiebreakerScore?: string,
    points: Point[]
};

/**
 * Adds a game to a set and creates the next set if the game being entered completes the set.
 * @param setId the set to add to
 * @param gameData game metadata used to add to set
 */
const addGameToSet = async (setId: number, gameData: GameData) => {
    try {
        //add the game
        const startTime = new Date(gameData.startTime);
        const addedGame = await prisma.game.create({
            data: {
                setId: setId,
                numberOfAdvantages: gameData.numberOfAdvantages,
                status: "COMPLETE",
                winnerId: gameData.winnerId,
                durationInMs: Date.now() - startTime.getTime(),
                startTime: startTime,
                serverId: gameData.serverId
            },
            include: {
                set: true
            }
        });
        //create and associate points to the finished game
        const points = gameData.points.map((point: Point) => {
            return {
                gameId: addedGame.id,
                gameScoreAfter: point.gameScoreAfter,
                gameScoreBefore: point.gameScoreBefore,
                winnerId: point.winnerId
            }
        });
        await prisma.point.createMany({data: points});
        //if the game finishes the set but not the match, update the set and then generate a new set
        //TODO:: make this a set middleware func and make it legit middleware
        if (gameData.gameCompletesSet) {
            const setStartTime = new Date(addedGame.set.createdAt).getTime();
            await prisma.set.update({
                where: {
                    id: setId
                }, 
                data: {
                    durationInMs: Date.now() - setStartTime,
                    winnerId: gameData.winnerId, //if this game finished the set, we know the game winner won the set
                    finalScore: gameData.finalSetScore,
                    tiebreakScore: gameData.tiebreakerScore || null,
                    status: "COMPLETE"
                }
            });
            if (!gameData.gameCompletesMatch) {
                await prisma.set.create({data: {
                    matchId: addedGame.set.matchId
                }})
            }
        }

        if (gameData.gameCompletesMatch) {
            const sets = await prisma.set.findMany({where: {matchId: addedGame.set.matchId}});
            const finalMatchScore = sets.map(set => set.finalScore).join(", ");
            const matchData = {
                winnerId: gameData.winnerId, //if this game finished the match, we know the game winner won the match,
                finalMatchScore: finalMatchScore
            };
            await finalizeMatch(sets[0].matchId, matchData);
        }
        return addedGame;
    } catch (error) {
        throw error;
    }
};

export {
    addGameToSet
}