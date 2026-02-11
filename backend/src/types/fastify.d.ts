import { Kysely } from "kysely";
import { Database } from "./database.types";
import EleringService from "../services/elering";

declare module 'fastify' {
    interface FastifyInstance {
        db: Kysely<Database>,
        eleringService: EleringService
    }

    interface FastifyRequest {
        db: Kysely<Database>,
        eleringService: EleringService
    }

}
