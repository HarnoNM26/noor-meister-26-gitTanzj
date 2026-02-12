
import type { InsertableData } from '../types'
import { LineChart } from '@mui/x-charts'

interface AvgPricePerLocationProps {
    data: InsertableData[],
    locationFilter: string,
}

export const AvgPricePerLocation = ({
    data,
    locationFilter
}: AvgPricePerLocationProps) => {
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
        const sum = avgData[i]
            .filter((elem) => elem.location === locationFilter)
            .reduce((avgPrice, i) => (avgPrice + Number(i.price_eur_mwh)), 0)

        return Number((sum / avgData[i].length).toFixed(2));
    }, [])

  return (
    <div>
        <h1>Average Price Per Location: showing {locationFilter}</h1>
        <LineChart
            xAxis={[{ scaleType: 'time', data: Object.keys(avgData) }]}
            series={[{ data: avgPrices }]}
            height={200}
        />
    </div>
  )
}
