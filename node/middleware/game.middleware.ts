import { PrismaClient } from '../generated/prisma';

import { completeMatch } from './match.middleware';
import { completeSet } from './set.middleware';

const prisma = new PrismaClient();

/**
 * Adds a game to a set.
 * @param setId the set to add to
 * @param gameData game metadata used to add to set
 */
const addGameToSet = async (setId: number, gameData: GameData) => {
  try {
    const set = await prisma.set.findUnique({
      where: { id: setId, status: 'INCOMPLETE' },
    });
    if (!set) return null;
    const startTime = new Date(gameData.startTime);
    const addedGame = await prisma.game.create({
      data: {
        setId: setId,
        numberOfAdvantages: gameData.numberOfAdvantages,
        status: 'COMPLETE',
        winnerId: gameData.winnerId,
        durationInMs: Date.now() - startTime.getTime(),
        startTime: startTime,
        serverId: gameData.serverId,
      },
      include: {
        set: true,
      },
    });

    const points = gameData.points.map((point: Point) => {
      return {
        gameId: addedGame.id,
        gameScoreAfter: point.gameScoreAfter,
        gameScoreBefore: point.gameScoreBefore,
        winnerId: point.winnerId,
      };
    });
    await prisma.point.createMany({ data: points });

    if (gameData.gameCompletesSet) {
      await completeSet(addedGame.set, gameData);
    }

    if (gameData.gameCompletesMatch) {
      await completeMatch(addedGame.set, gameData);
    }
    return addedGame;
  } catch (error) {
    throw error;
  }
};

export { addGameToSet };
