interface EnergyReadingTable {
    id: number,
    timestamp: string,
    location: string,
    price_eur_mwh?: number,
    source: "UPLOAD" | "API",
    created_at: string
}

export interface Database {
    EnergyReading: EnergyReadingTable
}

