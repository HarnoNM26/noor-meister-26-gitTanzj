import { createPool } from "mysql2";
import { Database } from "../types/database.types";
import { Kysely, MysqlDialect } from "kysely";

export const createDbConnection = () => {
    const dialect = new MysqlDialect({
        pool: createPool({
            database: "db",
            host: "mysql",
            user: "root",
            password: "root"
        })
    })

    return new Kysely<Database>({
        dialect
    })
}