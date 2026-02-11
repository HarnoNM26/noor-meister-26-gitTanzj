import { Kysely, sql } from 'kysely'
import { Database } from '../types/database.types';

export async function up(db: Kysely<Database>): Promise<void> {
console.log('Running migrations up')
  await db.schema
    .createTable('EnergyReading')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('timestamp', 'timestamp', (col) => col.notNull())
    .addColumn('location', 'varchar(100)', (col) => col.notNull())
    .addColumn('price_eur_mwh', 'numeric')
    .addColumn('source', sql`enum("UPLOAD", "API")`, (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('EnergyReading').execute();
}