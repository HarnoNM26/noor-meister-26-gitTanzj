import { LineChart } from '@mui/x-charts'
import { type InsertableData } from '../types'

interface PriceOverTimeProps {
    data: InsertableData[]
}

export const PriceOverTime = ({
    data
}: PriceOverTimeProps) => {
    if (data.length === 0) {
        return null;
    }

    return (
        <div>
            <h1>Price over time</h1>
            <LineChart
                xAxis={[{ scaleType: 'time', data: data.map((i) => new Date(i.timestamp)) }]}
                series={[{ data: data.map((i) => i.price_eur_mwh ), area: true, showMark: false }]}
                height={200}
                
            />
        </div>
    )
}
