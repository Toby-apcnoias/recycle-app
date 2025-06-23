import { useState } from 'react'
import axios from 'axios'

const TestApi = () => {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setStatus(null)
    
    try {
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
      const response = await axios.get(`${apiBase}/ping`)
      
      if (response.status === 200 && response.data.status === 'ok') {
        setStatus({ type: 'success', message: 'Backend is connected!' })
      } else {
        setStatus({ type: 'error', message: 'Unexpected response from backend' })
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: `Backend connection failed: ${error.message}` 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h3 className="card-title">🔧 API Health Check</h3>
        
        <div className="space-y-4">
          <button 
            className={`btn btn-outline ${loading ? 'loading' : ''}`}
            onClick={testConnection}
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test Backend Connection'}
          </button>
          
          {status && (
            <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              <span>{status.message}</span>
            </div>
          )}
          
          <div className="text-sm text-base-content/60">
            Backend URL: {import.meta.env.VITE_API_BASE || 'http://localhost:8000'}
          </div>
        </div>
      </div>
    </div>
  )  
}

export default TestApi 