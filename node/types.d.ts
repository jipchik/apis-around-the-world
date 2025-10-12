type MatchType = "SINGLES" | "DOUBLES";

type MatchData = {
    player1Id?: number,
    player2Id?: number,
    team1Id?: number,
    team2Id?: number,
    matchType?: MatchType,
    winnerId?: number,
    finalScore?: string,
};

type CreatePlayerData = {
    firstName: string,
    lastName: string,
    phoneNumber: string
};

type GetPlayerQueryData = {
    firstName?: string,
    lastName?: string,
    phoneNumber?: string
    include: boolean
};

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

type TeamData = {
    player1Id: number,
    player2Id: number,
    name: string
};