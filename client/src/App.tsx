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

function App() {
  const [data, setData] = useState<InsertableData[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<Dayjs | null>();
  const [endDate, setEndDate] = useState<Dayjs | null>();
  const [location, setLocation] = useState<'EE' | 'LV' | 'FI'>('EE');

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
      setSuccessMessage('Data has been successfully synced')
      setLoading(false);
    } else {
      setErrorMsg('There was something wrong with syncing the data')
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
    } else {
      setErrorMsg(response.data.message)
    }
    setLoading(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      await getReadings();
    }

    fetchData();
  }, [])

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
            <DatePicker value={startDate} onChange={(newVal) => setStartDate(newVal)}/>
            <p> to </p>
            <DatePicker value={endDate} onChange={(newVal) => setEndDate(newVal)}/>
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
    </LocalizationProvider>
  )
}

export default App
