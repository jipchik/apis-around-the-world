import { Request, Response } from 'express';

import { initializeMatch } from '../middleware/match.middleware';

const initialize = async (req: Request, res: Response) => {
    try {
        const initializedMatch = await initializeMatch(req.body);
        res.send({status: 200, data: initializedMatch})
    } catch (error) {
        res.send({status: 500, errorMessage: `Failed to initialize match due to: ${error}`})
    }
};

const patch = async (req: Request, res: Response) => {
    console.log("patches match data by updating important data")
};

export {
    initialize
}