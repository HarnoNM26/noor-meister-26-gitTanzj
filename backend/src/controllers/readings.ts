import { FastifyReply, FastifyRequest } from "fastify";
import * as energyReadingModel from '../models/energyReading';
import { GetReadingsParamsSchema, GetReadingsParamsSchemaType } from "../schemas/readings";

export const getReadings = {
    schema: {
        querystring: GetReadingsParamsSchema
    },
    async handler (req: FastifyRequest<
        {
            Params: GetReadingsParamsSchemaType
        }>, rep: FastifyReply) {
        const filters = req.params;
        const data = await energyReadingModel.getAll(req.db, filters);

        rep.status(200).send({
            data
        })
    }
}
