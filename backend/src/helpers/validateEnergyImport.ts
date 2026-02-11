import { InsertableData } from "../types/types";

const validateTimestamp = (timestamp: string) => {
    try {
        const timestampDate = new Date(timestamp);
        const isoString = timestampDate.toISOString()
        if (isoString) {
            return {
                success: true,
                value: isoString
            };
        }
    } catch {
        return {
            success: false
        };
    }
}

export const cleanEnergyData = (data: Array<{
    timestamp: string,
    location?: string,
    price_eur_mwh: string | number,
    price?: number,
    source: "UPLOAD" | "API"
}>, ignoreDuplicates: boolean) => {
    const resData: Array<InsertableData> = [];
    let allDuplicates: any[] = [];
    let skipped = 0;
    let succeeded = 0;
    
    for (let i = 0; i < data.length; i++) {
        const insert = {
            id: i,
            timestamp: undefined,
            location: undefined,
            price_eur_mwh: undefined,
            source: "UPLOAD"
        } as {
            id: number,
            timestamp?: string,
            location?: string,
            price_eur_mwh?: number,
            source: "UPLOAD" | "API"
        }
        const validatedTimestamp = validateTimestamp(data[i].timestamp);
        if (!validatedTimestamp?.success) {
            skipped++;
            continue;
        } else {
            insert.timestamp = validatedTimestamp.value as string
        }

        if (!data[i].location) {
            insert.location = "EE"
        } else {
            insert.location = data[i].location;
        }

        if (typeof data[i].price_eur_mwh === 'number') {
            insert.price_eur_mwh = data[i].price_eur_mwh as number
        } else if (typeof data[i].price_eur_mwh === 'string') {
            skipped++;
            continue;
        }

        if (data[i].source) {
            insert.source = data[i].source;
        }

        const duplicates = resData.filter((elem) => {
            elem.timestamp === insert.timestamp ||
            elem.location === insert.location
        })

        if (duplicates.length > 0 && ignoreDuplicates) {
            skipped++;
            allDuplicates = [...allDuplicates, ...duplicates]
            console.log('skipped because it is duplicate')
            continue;
        }
        
        resData.push(insert as InsertableData);
        succeeded++;
    }

    return {
        cleanedData: resData,
        succeeded,
        skipped,
        allDuplicates
    };
}
