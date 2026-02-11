import { FastifyPluginAsync } from "fastify"
import { getReadings } from '../../../controllers/readings'

const readings: FastifyPluginAsync = async (fastify, opts) => {
    fastify.get('/', getReadings)
}

export default readings;
