import { useEffect, useState } from 'react'
import axiosInstance from './utils/axiosInstance';
import './App.css'
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import type { Dayjs } from 'dayjs';

function App() {
  const [data, setData] = useState([]);
  console.log('data', data)
  const [successMessage, setSuccessMessage] = useState<string>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<Dayjs | null>();
  const [endDate, setEndDate] = useState<Dayjs | null>();
  const [location, setLocation] = useState<'ee' | 'lv' | 'fi'>('ee');

  const syncPrices = async () => {
    setLoading(true);
    const response = await axiosInstance.post('/api/sync/prices', {
      params: {
        start: startDate,
        end: endDate,
        location
      }
    })

    if (response.status === 200) {
      console.log('response', response)
      setData(response.data.data)
      setSuccessMessage('Data has been successfully synced')
      setLoading(false);
    } else {
      setErrorMsg('There was something wrong with syncing the data')
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get('/api/readings')
      setData(response.data.data.data);
    }

    fetchData();
  }, [])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="container">
        <div>
          {successMessage && <p>{successMessage}</p>}
          {errorMsg && <p>{errorMsg}</p>}
          <h2>Price sync</h2>
          <div>
            <DatePicker value={startDate} onChange={(newVal) => setStartDate(newVal)}/>
            <p> to </p>
            <DatePicker value={endDate} onChange={(newVal) => setEndDate(newVal)}/>
            <select onChange={(e) => setLocation(e.target.value as 'ee' | 'lv' | 'fi')}>
              <option value="ee">EE</option>
              <option value="lv">LV</option>
              <option value="fi">FI</option>
            </select>
          </div>
          <div>
            <button
              onClick={syncPrices}
              disabled={loading}
            >
              {loading ? '...Loading' : 'Sync Prices'}
            </button>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  )
}

export default App
