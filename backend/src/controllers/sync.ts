import { FastifyReply, FastifyRequest } from "fastify";
import { PostSyncPricesParamsSchema, PostSyncPricesParamsType } from "../schemas/readings";
import { getEndDate, getStartDate } from "../helpers/dateHelper";
import * as energyReadingModel from '../models/energyReading';
import { cleanEnergyData } from "../helpers/validateEnergyImport";

export const syncPrices = {
    schema: {
        querystring: PostSyncPricesParamsSchema
    },
    async handler (req: FastifyRequest<{
        Params: PostSyncPricesParamsType
    }>, rep: FastifyReply) {
        const {
            start,
            end,
            location
        } = req.params;

        const locationLower = location?.toLowerCase() as 'ee' | 'lv' | 'fi' | undefined;

        const { data: priceData, success } = await req.eleringService.getPrices({
            start: start || getStartDate(),
            end: end || getEndDate(),
            fields: [locationLower ?? 'ee']
        });

        if (!success) {
            rep.status(500).send({
                error: "PRICE_API_UNAVAILABLE"
            })
            return;
        }

        try {
            const cleaned = cleanEnergyData(priceData!.map((eleringDataPiece) => ({
                timestamp: (new Date(eleringDataPiece.timestamp)).toISOString(),
                price_eur_mwh: eleringDataPiece.price,
                source: "API"
            })), true);

            cleaned.cleanedData.forEach(async (row) => {
                await energyReadingModel.deleteByTimestampAndLocation(
                    req.db,
                    row.timestamp,
                    row.location as 'LV' | 'EE' | 'FI'
                )

                const insertionResult = await energyReadingModel.createEnergyReading(
                    req.db,
                    row
                )

                if (!insertionResult.success) {
                    throw new Error('Insertion wasnt successful')
                }
            })
        } catch (error) {
            console.log('Error inserting synced data')
            rep.send(500).send({
                error: 'Error inserting synced data'
            })
            return;
        }

        rep.status(201).send({
            success: true,
            data: priceData
        })
    }
}
