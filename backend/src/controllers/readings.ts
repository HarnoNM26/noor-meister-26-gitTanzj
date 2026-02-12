import { FastifyReply, FastifyRequest } from "fastify";
import * as energyReadingModel from '../models/energyReading';
import { DeleteReadingsQuerySchema, DeleteReadingsQueryType, GetReadingsParamsSchema, GetReadingsParamsSchemaType } from "../schemas/readings";
import { validateEndDateGreaterThanStartDate } from "../validators";

export const getReadings = {
    schema: {
        querystring: GetReadingsParamsSchema
    },
    async handler (req: FastifyRequest<
        {
            Querystring: GetReadingsParamsSchemaType
        }>, rep: FastifyReply) {
        const filters = req.query;

        if (filters.start && filters.end && !validateEndDateGreaterThanStartDate(filters.start, filters.end)) {
            rep.status(400).send({
                error: 'End date must be greater than start date'
            });
            return;
        }

        const data = await energyReadingModel.getAll(req.db, filters, false);

        rep.status(200).send({
            data
        })
    }
}

export const deleteReadings = {
    schema: {
        querystring: DeleteReadingsQuerySchema
    }, 
    async handler (req: FastifyRequest<{
        Querystring: DeleteReadingsQueryType
    }>, rep: FastifyReply) {
        try {
            const result = await energyReadingModel.deleteEnergyReadingBySource(
                req.db,
                req.query.source
            )

            const deletedRows = Number(result[0].numDeletedRows);

            if (deletedRows > 0) {
                rep.status(201).send({
                    success: true,
                    deleted: deletedRows,
                    message: `Deleted ${deletedRows} ${req.query.source} records`
                });
                return;
            } 
        
            rep.status(200).send({
                message: `No ${req.query.source} records found`
            })
            
        } catch (error) {
            rep.status(500).send({
                error: 'Cleanup failed. Please try again.'
            })
        }
    }
}
