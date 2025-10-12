import { Request, Response } from 'express';

import { addGameToSet } from '../middleware/game.middleware';

const addGame = async (req: Request, res: Response) => {
  try {
    const addedGame = await addGameToSet(Number(req.params.id), req.body);
    if (addedGame) {
      res.send({ status: 200, data: addedGame });
    } else {
      res.send({
        status: 400,
        message: 'Set not found or is already complete.',
      });
    }
  } catch (error) {
    res.send({
      status: 500,
      errorMessage: `Failed to add game to set due to: ${error}`,
    });
  }
};

export { addGame };
