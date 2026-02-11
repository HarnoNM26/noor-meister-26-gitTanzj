import { FastifyPluginAsync } from "fastify";
import { syncPrices } from "../../../controllers/sync";

const sync: FastifyPluginAsync = async (fastify, opts) => {
    fastify.post('/prices', syncPrices)
}

export default sync
