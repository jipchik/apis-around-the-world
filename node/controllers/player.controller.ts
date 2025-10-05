import { Request, Response } from 'express';
import { createPlayer, getPlayerByQuery } from "../middleware/player.middleware";

const create = async (req: Request, res: Response) => {
    const playerData = req.body;
    try {
        const createdPlayer = await createPlayer(playerData);

        res.send({status: 200, data: createdPlayer});

    } catch (error) {
        res.send({status: 500, errorMessage: `Failed to create player due to: ${error}`})
    }
};

const findOneByQuery = async (req: Request, res: Response) => {
    try {
        const retreivedPlayer = await getPlayerByQuery(req.query as any);

        res.send({status: 200, data: retreivedPlayer});
    } catch (error) {
        res.send({status: 500, errorMessage: `Failed to retrieve player due to: ${error}`})
    }
}

export {
    create,
    findOneByQuery
}