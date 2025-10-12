import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const createTeam = async (teamData: TeamData) => {
  try {
    let addedTeam = null;
    const [isValid, reason] = await validateTeam(teamData);
    if (isValid) {
      addedTeam = await prisma.team.create({
        data: {
          name: teamData.name,
          teamPlayers: {
            create: [
              {
                player: {
                  connect: { id: Number(teamData.player1Id) },
                },
              },
              {
                player: {
                  connect: { id: Number(teamData.player2Id) },
                },
              },
            ],
          },
        },
      });
    }
    return [addedTeam, reason];
  } catch (error) {
    throw error;
  }
};

const validateTeam = async (teamData: TeamData) => {
  const player1 = await prisma.player.findUnique({
    where: { id: teamData.player1Id },
  });
  if (!player1) {
    return [false, 'Player 1 not found.'];
  }

  const player2 = await prisma.player.findUnique({
    where: { id: teamData.player2Id },
  });
  if (!player2) {
    return [false, 'Player 2 not found.'];
  }

  const team = await prisma.team.findUnique({ where: { name: teamData.name } });
  if (team) {
    return [false, 'Team with this name already exists.'];
  }
  return [true, null];
};

const findTeam = async (id: number) => {
  try {
    const retrievedTeam = await prisma.team.findUnique({
      where: { id: id },
      include: {
        teamPlayers: {
          include: {
            player: true,
          },
        },
      },
    });

    return retrievedTeam;
  } catch (error) {
    throw error;
  }
};

export { createTeam, findTeam };
