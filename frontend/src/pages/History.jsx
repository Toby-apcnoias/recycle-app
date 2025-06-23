import { useState, useEffect } from 'react'
import HistoryTable from '../components/HistoryTable'

const History = () => {
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState({
    totalItems: 0,
    totalCoins: 0,
    favoriteMaterial: null
  })

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('history') || '[]')
    // Sort by timestamp descending (newest first)
    const sortedHistory = savedHistory.sort((a, b) => b.timestamp - a.timestamp)
    setHistory(sortedHistory)

    // Calculate stats
    if (sortedHistory.length > 0) {
      const totalCoins = sortedHistory.reduce((sum, item) => sum + item.coinsEarned, 0)
      
      // Find most common material
      const materialCount = {}
      sortedHistory.forEach(item => {
        materialCount[item.material] = (materialCount[item.material] || 0) + 1
      })
      
      const favoriteMaterial = Object.entries(materialCount)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || null

      setStats({
        totalItems: sortedHistory.length,
        totalCoins,
        favoriteMaterial
      })
    }
  }, [])

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      localStorage.removeItem('history')
      setHistory([])
      setStats({
        totalItems: 0,
        totalCoins: 0,
        favoriteMaterial: null
      })
    }
  }

  const getMaterialEmoji = (material) => {
    const emojiMap = {
      'Wood': '🪵',
      'Glass': '🍶',
      'Steel': '⚙️',
      'Copper': '🔶',
      'Aluminum': '🥫',
      'Iron': '🔩',
      'Plastic-PET': '🍼',
      'Plastic-HDPE': '🧴',
      'Electrical Wiring': '⚡',
      'Plumbing-PVC': '🚰'
    }
    return emojiMap[material] || '♻️'
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">📋 Recycling History</h1>
        <p className="text-lg text-base-content/60">
          Track your recycling progress and environmental impact
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-title">Total Items Recycled</div>
          <div className="stat-value text-primary">{stats.totalItems}</div>
          <div className="stat-desc">Keep up the great work! 🌱</div>
        </div>
        
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-title">Total Coins Earned</div>
          <div className="stat-value text-success">{stats.totalCoins.toFixed(2)} 🪙</div>
          <div className="stat-desc">Environmental reward points</div>
        </div>
        
        <div className="stat bg-base-100 rounded-lg shadow-lg">
          <div className="stat-title">Favorite Material</div>
          <div className="stat-value text-secondary">
            {stats.favoriteMaterial ? (
              <>
                {getMaterialEmoji(stats.favoriteMaterial)} {stats.favoriteMaterial}
              </>
            ) : (
              'None yet'
            )}
          </div>
          <div className="stat-desc">Most recycled item</div>
        </div>
      </div>

      {/* History Table */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <h2 className="card-title text-2xl">📊 Recycling Timeline</h2>
            {history.length > 0 && (
              <button 
                className="btn btn-outline btn-error btn-sm"
                onClick={clearHistory}
              >
                🗑️ Clear History
              </button>
            )}
          </div>
          
          <HistoryTable history={history} />
        </div>
      </div>

      {/* Environmental Impact */}
      {history.length > 0 && (
        <div className="card bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 shadow-lg">
          <div className="card-body text-center">
            <h3 className="text-2xl font-bold mb-4">🌍 Environmental Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">🌱</span>
                <span>You've contributed to a cleaner environment</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">♻️</span>
                <span>Promoting circular economy principles</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default History 