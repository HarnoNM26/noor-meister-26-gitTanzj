import { FastifyPluginAsync } from "fastify";
import { getInsights } from "../../../controllers/insights";

const insightsRoutes: FastifyPluginAsync = async (fastify, opts) => {
    fastify.get('/prices', getInsights)
}

export default insightsRoutes;
