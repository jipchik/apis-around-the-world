import { PrismaClient, Set } from '../generated/prisma';

const prisma = new PrismaClient();

import { findTeam } from './team.middleware';

const initializeMatch = async (matchData: MatchData) => {
  try {
    let createdMatch = null;
    const [isValid, reason] = await validateMatchData(matchData);
    if (isValid) {
      createdMatch = await prisma.match.create({
        data: {
          type: matchData.matchType!,
          ...(matchData.matchType === 'SINGLES' && {
            player1Id: matchData.player1Id,
            player2Id: matchData.player2Id,
          }),
          ...(matchData.matchType === 'DOUBLES' && {
            team1Id: matchData.team1Id,
            team2Id: matchData.team2Id,
          }),
          sets: {
            create: {},
          },
        },
      });
    }
    return [createdMatch, reason];
  } catch (error) {
    throw error;
  }
};

const finalizeMatch = async (id: number, updateData: MatchData) => {
  let updatedMatch = null;
  try {
    const match = await prisma.match.findUnique({ where: { id: id } });

    if (match && match.status !== 'COMPLETE') {
      const matchStartTime = new Date(match.createdAt).getTime();
      const now = Date.now();

      const duration = now - matchStartTime;
      updatedMatch = await prisma.match.update({
        data: {
          durationInMs: duration,
          status: 'COMPLETE',
          winnerId: updateData.winnerId,
          finalScore: updateData.finalScore,
        },
        where: {
          id: match.id,
        },
      });
    }
    return updatedMatch;
  } catch (error) {
    throw error;
  }
};

const completeMatch = async (set: Set, gameData: GameData) => {
  const sets = await prisma.set.findMany({ where: { matchId: set.matchId } });
  const finalMatchScore = sets.map(set => set.finalScore).join(', ');
  const matchData = {
    winnerId: gameData.winnerId, //if this game finished the match, we know the game winner won the match,
    finalScore: finalMatchScore,
  };
  await finalizeMatch(sets[0].matchId, matchData);
};

const validateMatchData = async (matchData: MatchData) => {
  const values = Object.values(matchData);
  const entriesHaveValues = values.every(value => value);

  if (!entriesHaveValues) return [false, 'Missing required values.'];

  if (matchData.matchType === 'DOUBLES' && !matchData.team1Id && !matchData.team2Id) {
    if (matchData.team1Id === matchData.team2Id) {
      return [false, 'Doubles matches must have different teams.'];
    } else {
      return [false, 'Doubles matches require team data.'];
    }
  }

  if (matchData.team1Id && matchData.team2Id) {
    const team1 = await findTeam(matchData.team1Id);
    const team2 = await findTeam(matchData.team2Id);
    const team1PlayerIds = team1?.teamPlayers.map(player => player.playerId);
    const team2PlayerIds = team2?.teamPlayers.map(player => player.playerId);
    const duplicatePlayerFound = team1PlayerIds?.some(playerId => team2PlayerIds?.includes(playerId));
    if (duplicatePlayerFound) {
      return [false, 'Duplicate player found, players can only be on one team in a match.'];
    }
  }

  if (matchData.matchType === 'SINGLES' && !matchData.player1Id && !matchData.player2Id) {
    if (matchData.player1Id === matchData.player2Id) {
      return [false, 'Singles matches must have different players.'];
    } else {
      return [false, 'Singles matches require player data.'];
    }
  }

  return [true, ''];
};

export { completeMatch, finalizeMatch, initializeMatch };
