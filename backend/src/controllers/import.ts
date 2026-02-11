import { FastifyRequest, FastifyReply } from "fastify";
import { cleanEnergyData } from "../helpers/validateEnergyImport";
import * as energyReadingModel from '../models/energyReading'

export const importJson = {
    schema: {
        
    },
    async handler (req: FastifyRequest, rep: FastifyReply) {
       const data = await req.file();

        if (!data) {
            return rep.code(400).send({ error: "No file uploaded" })
        }

        const file = data.file; 
        const fileAsJson = JSON.parse(file.read());

        const {
            cleanedData,
            succeeded,
            skipped
        } = cleanEnergyData(fileAsJson, true);

        try {
            cleanedData.forEach(async (piece) => {
                await energyReadingModel.createEnergyReading(req.db, piece);
            })
        } catch (error) {
            console.error('Failed to insert into db')
            rep.status(500).send({
                error: 'Failed to insert into db'
            })
        }

        rep.status(200).send({
            cleanedData,
            succeeded,
            skipped
        })
    }
}
