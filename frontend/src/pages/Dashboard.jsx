import { useState } from 'react'
import axios from 'axios'
import Upload from '../components/Upload'
import ResultCard from '../components/ResultCard'
import TestApi from '../components/TestApi' 
import { useCoins } from '../hooks/useCoins.jsx'

const Dashboard = () => {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const { changeCoins } = useCoins()

  const handleUploadComplete = async (downloadURL, file) => {
    setUploadedImage({ url: downloadURL, file })
    setResult(null)
    setLoading(true)

    try {
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
      
      // Create FormData for the API call
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await axios.post(`${apiBase}/classify`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const { material, confidence, coinsEarned } = response.data
      
      // Update coins
      changeCoins(coinsEarned)
      
      // Add to history
      const historyItem = {
        timestamp: Date.now(),
        material,
        coinsEarned
      }
      
      const existingHistory = JSON.parse(localStorage.getItem('history') || '[]')
      existingHistory.push(historyItem)
      localStorage.setItem('history', JSON.stringify(existingHistory))
      
      setResult({ material, confidence, coinsEarned })
      
    } catch (error) {
      console.error('Classification failed:', error)
      // Show error state
      setResult({ 
        error: true, 
        message: error.response?.data?.detail || 'Classification failed. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNewUpload = () => {
    setResult(null)
    setUploadedImage(null)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">♻️ Recycle Dashboard</h1>
        <p className="text-lg text-base-content/60">
          Upload an image to classify recyclable materials and earn coins!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title mb-4">📸 Upload Image</h2>
              
              {!uploadedImage && !loading ? (
                <Upload onUploadComplete={handleUploadComplete} />
              ) : (
                <div className="space-y-4">
                  {uploadedImage && (
                    <div className="relative">
                      <img 
                        src={uploadedImage.url} 
                        alt="Uploaded" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <button 
                          className="btn btn-sm btn-circle btn-error"
                          onClick={handleNewUpload}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {loading && (
                    <div className="text-center space-y-2">
                      <span className="loading loading-spinner loading-lg"></span>
                      <div>Classifying your image...</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <TestApi />
        </div>

        <div className="space-y-6">
          {result && !result.error && (
            <ResultCard result={result} />  
          )}
          
          {result && result.error && (
            <div className="alert alert-error">
              <span>{result.message}</span>
            </div>
          )}

          {!result && !loading && (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Ready to Recycle?</h3>
                <p className="text-base-content/60">
                  Upload an image to get started with AI-powered material classification
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard 