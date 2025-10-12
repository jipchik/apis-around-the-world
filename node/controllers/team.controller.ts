import { Request, Response } from 'express';
import { createTeam, findTeam } from "../middleware/team.middleware";

const create = async (req: Request, res: Response) => {
    const teamData = req.body;
    try {
        const [createdTeam, reason] = await createTeam(teamData);
        if (createdTeam) {
            res.send({status: 200, data: createdTeam});
        } else {
            res.send({status: 400, message: reason })
        }

    } catch (error) {
        res.send({status: 500, errorMessage: `Failed to create team due to: ${error}`})
    }
};

const findOne = async (req: Request, res: Response) => {
    const teamId = Number(req.params.id);
    try {
        const retrievedTeam = await findTeam(teamId);

        res.send({status: 200, data: retrievedTeam});
    } catch (error) {
        res.send({status: 500, errorMessage: `Failed to retrieve team due to ${error}`});
    }
};

export {
    create,
    findOne
}