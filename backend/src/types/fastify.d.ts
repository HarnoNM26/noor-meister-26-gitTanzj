import { Kysely } from "kysely";
import { Database } from "./database.types";

declare module 'fastify' {
    interface FastifyInstance {
        db: Kysely<Database>
    }

    interface FastifyRequest {
        db: Kysely<Database>
    }

}