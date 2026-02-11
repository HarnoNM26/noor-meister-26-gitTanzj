import { FastifyPluginAsync } from "fastify"
import { getHealth } from "../../../controllers/health"

const health: FastifyPluginAsync = async (fastify, opts) => {
    fastify.get('/', getHealth)
}

export default health