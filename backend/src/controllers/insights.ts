import { FastifyReply, FastifyRequest } from "fastify";
import { GetInsightsQuerySchema, GetInsightsQueryType } from "../schemas/readings";
import * as energyReadingModel from '../models/energyReading';
import { InsertableData } from "../types/types";

export const getInsights = {
    schema: {
        querystring: GetInsightsQuerySchema
    }, 
    async handler (req: FastifyRequest<{
        Querystring: GetInsightsQueryType
    }>, rep: FastifyReply) {
        const readingsResult = await energyReadingModel.getAll(
            req.db,
            req.query,
            true
        );

        if (!readingsResult.success) {
            rep.status(500).send({
                error: "Something went wrong"
            })
            return;
        }

        const readings = readingsResult.data.filter((elem) => !!elem.price_eur_mwh) as InsertableData[];

        if (!readings.length) {
            rep.status(200).send({
                error: "NO_PRICE_DATA"
            })
            return
        }
 
        const getAveragePrice = () => {
            const sum = readings.reduce((acc, i) => acc + Number(i.price_eur_mwh), 0);

            return Number((sum / readings.length).toFixed(2));
        }

        const getMinPrice = () => {
            let min = 0;
            for (let i = 0; i < readings.length; i++) {
                if (readings[i].price_eur_mwh < min) {
                    min = readings[i].price_eur_mwh;
                }
            }
        }

        const getMaxPrice = () => {
            let max = 0;
            for (let i = 0; i < readings.length; i++) {
                if (readings[i].price_eur_mwh > max) {
                    max = readings[i].price_eur_mwh;
                }
            }
        }

        const getMostExpensiveSlots = () => {
            const sortedByPrice = readings.sort((a, b) => b.price_eur_mwh - a.price_eur_mwh);

            const res = [];
            for (let i = 0; i < 3 || sortedByPrice[i] === undefined; i++) {
                res.push(sortedByPrice[i])
            }
            return res;
        }

        const getCheapestSlots = () => {
            const sortedByPrice = readings.sort((a, b) => a.price_eur_mwh - b.price_eur_mwh);

            const res = [];
            for (let i = 0; i < 3 || sortedByPrice[i] === undefined; i++) {
                res.push(sortedByPrice[i])
            }
            return res;
        }


        rep.status(200).send({
            average_price: getAveragePrice(),
            min_price: getMinPrice(),
            max_price: getMaxPrice(),

            cheapest_slots: getCheapestSlots(),
            most_expensive_slots: getMostExpensiveSlots(),
        })
    }
}
 