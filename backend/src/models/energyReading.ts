import { Kysely } from "kysely";
import { Database } from "../types/database.types";
import { InsertableData } from "../types/types";

export const getAll = async (db: Kysely<Database>, {
    start,
    end,
    location
}: { start?: string, end?:string, location?: string}) => {
    const query = db
        .selectFrom('EnergyReading')
        .selectAll()
    
    if (start) {
        query.where('EnergyReading.timestamp', '>', start);
    }

    if (end) {
        query.where('EnergyReading.timestamp', '<', end);
    }

    if (location) {
        query.where('EnergyReading.location', '=', location)
    }

    const response = await query.execute()

    return {
        success: true,
        data: response
    };
}

export const deleteByTimestampAndLocation = async (db: Kysely<Database>, timestamp:string, location: 'EE' | 'LV' | 'FI') => {
    const response = await db
        .deleteFrom('EnergyReading')
        .where('EnergyReading.location', '=', location)
        .where('EnergyReading.timestamp', '=', timestamp)
        .execute();
    
    return response;
}

export const createEnergyReading = async (db: Kysely<Database>, data: InsertableData) => {
    const randomID = Math.random() * 1000000000;
    const response = await db
        .insertInto('EnergyReading')
        .values({
            id: randomID,
            timestamp: data.timestamp,
            source: data.source,
            location: data.location,
            price_eur_mwh: data.price_eur_mwh,
            created_at: (new Date()).toISOString()
        })
        .execute();

    if (!response.length) {
        return {
            success: false
        }
    }

    console.log('response', response);
    
    return { 
        success: true
    }
}

export const deleteEnergyReading = async (db: Kysely<Database>, id: number) => {
    const result = await db.deleteFrom('EnergyReading')
        .where('EnergyReading.id', '=', id)
        .execute();

    return result;
}

export const deleteEnergyReadingBySource = async (db: Kysely<Database>, source: "UPLOAD" | "API") => {
    const result = await db.deleteFrom('EnergyReading')
        .where('EnergyReading.source', '=', source)
        .execute();

    return result;
}
