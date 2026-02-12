import { LineChart } from '@mui/x-charts'
import { type InsertableData } from '../types'
import { useMemo } from 'react'

interface ComparePricesProps {
    data: InsertableData[],
    locationFilter: string,
}

export const ComparePrices = ({
    data,
    locationFilter
}: ComparePricesProps) => {

    const seriesUsed = useMemo(() => {
        return {
            id: locationFilter,
            data: data?.filter((elem) => elem.location === locationFilter).map((elem) => elem.price_eur_mwh),
            area: true,
            showMark: false
        }
    }, [data, locationFilter])

    if (data.length === 0) {
        return null;
    }

  return (
    <div>
        <h1>Compare prices</h1>
        <LineChart
            xAxis={[{
                data: data.map((elem) => new Date(elem.timestamp)),
                scaleType: 'time',
            }]}
            series={[
                seriesUsed,
            ]}
            height={200}
        />
    </div>
  )
}
