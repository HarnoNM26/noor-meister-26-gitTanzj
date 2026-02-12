import { FastifyPluginAsync } from "fastify"
import { getReadings, deleteReadings } from '../../../controllers/readings'

const readings: FastifyPluginAsync = async (fastify, opts) => {
    fastify.get('/', getReadings),
    fastify.delete('/', deleteReadings);
}

export default readings;
