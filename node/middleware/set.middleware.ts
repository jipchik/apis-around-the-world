import { PrismaClient, Set } from '../generated/prisma';

const prisma = new PrismaClient();

const completeSet = async (set: Set, gameData: GameData) => {
  const setStartTime = new Date(set.createdAt).getTime();
  await prisma.set.update({
    where: {
      id: set.id,
    },
    data: {
      durationInMs: Date.now() - setStartTime,
      winnerId: gameData.winnerId, //if this game finished the set, we know the game winner won the set
      finalScore: gameData.finalSetScore,
      tiebreakScore: gameData.tiebreakerScore || null,
      status: 'COMPLETE',
    },
  });
  if (!gameData.gameCompletesMatch) {
    await prisma.set.create({
      data: {
        matchId: set.matchId,
      },
    });
  }
};

export { completeSet };
