import { Request, Response } from 'express';

import { finalizeMatch, initializeMatch } from '../middleware/match.middleware';

const initialize = async (req: Request, res: Response) => {
    try {
        const [initializedMatch, reason] = await initializeMatch(req.body);
        if (initializedMatch) {
            res.send({status: 200, data: initializedMatch})
        } else {
            res.send({status: 400, message: reason})
        }
    } catch (error) {
        res.send({status: 500, errorMessage: `Failed to initialize match due to: ${error}`})
    }
};

const finalize = async (req: Request, res: Response) => {
    try {
        const finalizedMatch = await finalizeMatch(Number(req.params.id), req.body);
        if (finalizedMatch) {
            res.send({status: 200, data: finalizedMatch})
        } else {
            res.send({status: 400, message: "Match not found or is already complete."})
        }
    } catch (error) {
        res.send({status: 500, errorMessage: `Failed to finalize match due to: ${error}`})
    }
};

export {
    finalize,
    initialize
}