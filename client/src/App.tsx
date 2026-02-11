import { useEffect, useState } from 'react'
import axiosInstance from './utils/axiosInstance';
import './App.css'

function App() {
  const [serverHealth, setServerHealth] = useState({
    status: undefined,
    db: undefined
  })

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get('/api/health')
      setServerHealth(response.data);
    }

    fetchData();
  }, [])

  return (
    <div>
      {serverHealth.status === "ok" ?
        (<div>
          <p>Backend OK</p>
        </div>)
        :
        (<div>
          <p>Sorry, our service is currently having some trouble.</p>
        </div>) 
      }
    </div>
  )
}

export default App
