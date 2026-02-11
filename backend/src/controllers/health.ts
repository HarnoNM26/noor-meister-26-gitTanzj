import { FastifyRequest, FastifyReply } from "fastify";

export const getHealth = {
    async handler (req: FastifyRequest, rep: FastifyReply) {
        const dbOk = !!req.db;
        
        rep.status(200).send({
            status: "ok",
            db: dbOk ? "ok": "error"
        })
    }
}