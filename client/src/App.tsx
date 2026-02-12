import { useEffect, useState, useMemo } from 'react'
import axiosInstance from './utils/axiosInstance';
import './App.css'
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import type { Dayjs } from 'dayjs';
import { PriceOverTime } from './components/PriceOverTime';
import type { InsertableData } from './types';
import { DailyAvgPrice } from './components/DailyAvgPrice';
import { AvgPricePerLocation } from './components/AvgPricePerLocation';
import { ComparePrices } from './components/ComparePrices';

const initialInsightsData = {
    average_price: undefined,
    cheapest_slots: [],
    most_expensive_slots: [],
  }

function App() {
  const [data, setData] = useState<InsertableData[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<Dayjs | null>();
  const [endDate, setEndDate] = useState<Dayjs | null>();
  const [location, setLocation] = useState<'EE' | 'LV' | 'FI'>('EE');

  const [insightsStart, setInsightsStart] = useState<Dayjs | null>();
  const [insightsEnd, setInsightsEnd] = useState<Dayjs | null>();
  const [insightsLocation, setInsightsLocation] = useState<'EE' | 'LV' | 'FI'>('EE');

  const [insightsErrorMsg, setInsightsErrorMsg] = useState<string>();

  const [insightsData, setInsightsData] = useState<{
    average_price?: number,
    cheapest_slots: InsertableData[],
    most_expensive_slots: InsertableData[]
  }>(initialInsightsData)

  const getReadings = async () => {
    const response = await axiosInstance.get('/api/readings', {
      params: {
        start: startDate?.toISOString(),
        end: endDate?.toISOString(),
        location
      }
    })
    setData(response.data.data.data);
  }

  const syncPrices = async () => {
    setLoading(true);
    const response = await axiosInstance.post('/api/sync/prices', {}, {
      params: {
        start: startDate?.toISOString(),
        end: endDate?.toISOString(),
        location
      }
    })

    if (response.status === 201) {
      await getReadings();
      setInsightsData(initialInsightsData)
      setInsightsStart(null);
      setInsightsEnd(null);
      setSuccessMessage('Data has been successfully synced')
      setTimeout(() => {
        setSuccessMessage(undefined);
      }, 2000)
      setLoading(false);
    } else {
      setErrorMsg('There was something wrong with syncing the data');
      setTimeout(() => {
        setErrorMsg(undefined);
      }, 2000)
      setLoading(false);
    }
  }

  const deleteUploadRecords = async () => {
    const response = await axiosInstance.delete('/api/readings', {
      params: {
        source: "UPLOAD"
      }
    })

    if (response.status >= 200) {
      getReadings();
      setSuccessMessage(response.data.message)
      setTimeout(() => {
        setSuccessMessage(undefined);
      }, 2000)
    } else {
      setErrorMsg(response.data.message)
      setTimeout(() => {
        setErrorMsg(undefined);
      }, 2000)
    }
    setLoading(false);
  }

  const getInsightsReport = async () => {
    const response = await axiosInstance.get('/api/insights/prices', {
      params: {
        start: insightsStart?.toISOString(),
        end: insightsEnd?.toISOString(),
        location: insightsLocation
      }
    })

    if (response.data.error) {
      setInsightsErrorMsg('Sorry, no price data available right now. Please try again later.')
      setTimeout(() => {
        setInsightsErrorMsg(undefined);
      }, 2000)
      return;
    }

    if (response.status >= 200) {
      setInsightsData(response.data)
      setSuccessMessage(response.data.message)
      setTimeout(() => {
        setSuccessMessage(undefined);
      }, 2000)
    } else {
      setErrorMsg(response.data.message)
      setTimeout(() => {
        setErrorMsg(undefined);
      }, 2000)
    }
    setLoading(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (insightsEnd && insightsStart) {
        await getInsightsReport();
      }
      await getReadings();
    }

    fetchData();
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (insightsEnd && insightsStart) {
        await getInsightsReport();
      }
    }

    fetchData();
  }, [insightsEnd, insightsStart])

  const orderedData = useMemo(() => {
    return data?.sort((a, b) => {
        const aDate = (new Date(a.timestamp)).getTime();
        const bDate = (new Date(b.timestamp)).getTime();

        return aDate - bDate
    })
  }, [data]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="container">
        <div>
          <div className="grid-container">
            <PriceOverTime
              data={orderedData}
            />
            <DailyAvgPrice
              data={orderedData}
            />
            <AvgPricePerLocation
              data={orderedData}
              locationFilter={location}
            />
            <ComparePrices
              data={orderedData}
              locationFilter={location}
            />
          </div>
          {successMessage && <p>{successMessage}</p>}
          {errorMsg && <p>{errorMsg}</p>}
          <h2>Price sync</h2>
          <div>
            <div className="date-picker-container">
              <DatePicker value={startDate} onChange={(newVal) => setStartDate(newVal)}/>
              <p> to </p>
              <DatePicker value={endDate} onChange={(newVal) => setEndDate(newVal)}/>
            </div>
            <select onChange={(e) => setLocation(e.target.value as 'EE' | 'LV' | 'FI')}>
              <option value="EE">EE</option>
              <option value="LV">LV</option>
              <option value="FI">FI</option>
            </select>
          </div>
          <div>
            <button
              onClick={syncPrices}
              disabled={loading}
            >
              {loading ? '...Loading' : 'Sync Prices'}
            </button>
            <button
              onClick={deleteUploadRecords}
              disabled={loading}
            >
              {loading ? '...Loading' : "Delete UPLOAD data"}
            </button>
          </div>
        </div>
      </div>
      <hr></hr>
      <div>
        {insightsErrorMsg && <p>{insightsErrorMsg}</p>}
        <h2>Insights</h2>
          <div>
            <div className="date-picker-container">
              <DatePicker value={startDate} onChange={(newVal) => setInsightsStart(newVal)}/>
              <p> to </p>
              <DatePicker value={endDate} onChange={(newVal) => setInsightsEnd(newVal)}/>
            </div>
            <select onChange={(e) => setInsightsLocation(e.target.value as 'EE' | 'LV' | 'FI')}>
              <option value="EE">EE</option>
              <option value="LV">LV</option>
              <option value="FI">FI</option>
            </select>
          </div>
          <div>
            <h3>average price</h3>
            {insightsData.average_price ? <p>{insightsData.average_price} €/MWh</p> : <p>No data selected</p>}
            <h3>cheapest slots</h3>
            <div>
              {insightsData.cheapest_slots.map((elem) => (
                <p>{(new Date(elem.timestamp)).toUTCString()} - {elem.price_eur_mwh} €/MWh</p>
              ))}
            </div>
            <h3>most expensive slots</h3>
            <div>
              {insightsData.most_expensive_slots.map((elem) => (
                <p>{(new Date(elem.timestamp)).toUTCString()} - {elem.price_eur_mwh} €/MWh</p>
              ))}
            </div>
          </div>
      </div>

    </LocalizationProvider>
  )
}

export default App
