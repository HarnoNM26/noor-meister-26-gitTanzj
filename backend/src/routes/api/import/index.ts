import { FastifyPluginAsync } from "fastify";
import { importJson } from '../../../controllers/import';

const importRoutes: FastifyPluginAsync = async (fastify, opts) => {
    fastify.post('/json', importJson)
}

export default importRoutes;
