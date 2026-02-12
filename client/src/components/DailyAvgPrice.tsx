import type { InsertableData } from '../types'
import { LineChart } from '@mui/x-charts'

interface DailyAvgPriceProps {
    data: InsertableData[]
}

export const DailyAvgPrice = ({
    data
}: DailyAvgPriceProps) => {

    if (data.length === 0) {
        return null;
    }

    const avgData: Record<string, InsertableData[]> = data.reduce((groupedData: Record<string, InsertableData[]>, elem) => {
        const { timestamp } = elem;

        const timeAsDay = (new Date(timestamp)).getUTCDay();
        if (!groupedData[timeAsDay]) {
            groupedData[timeAsDay] = [];
        }

        groupedData[timeAsDay].push(elem);
        return groupedData;
    }, {})

    const avgPrices = Object.keys(avgData).map((i) => {
        const sum = avgData[i].reduce((avgPrice, i) => (avgPrice + Number(i.price_eur_mwh)), 0)

        return Number((sum / avgData[i].length).toFixed(2));
    }, [])

  return (
    <div>
        <h1>Daily average price</h1>
        <LineChart
            xAxis={[{ scaleType: 'time', data: Object.keys(avgData) }]}
            series={[{ data: avgPrices }]}
            height={200}
        />
    </div>
  )
}
