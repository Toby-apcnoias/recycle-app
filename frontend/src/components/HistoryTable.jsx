const HistoryTable = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📋</div>
        <div className="text-lg">No recycling history yet</div>
        <div className="text-sm text-base-content/60">Start recycling to see your history here!</div>
      </div>
    )
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

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRecyclingCenterUrl = (material) => {
    const query = encodeURIComponent(`${material} recycling center near me`)
    return `https://www.google.com/maps/search/${query}`
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Date</th>
            <th>Material</th>
            <th>Coins Earned</th>
            <th>Find Recycling</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={index}>
              <td>{formatDate(item.timestamp)}</td>
              <td>
                <div className="flex items-center gap-2">
                  <span>{getMaterialEmoji(item.material)}</span>
                  <span>{item.material}</span>
                </div>
              </td>
              <td>
                <div className="badge badge-success">
                  +{item.coinsEarned.toFixed(2)} 🪙
                </div>
              </td>
              <td>
                <a
                  href={getRecyclingCenterUrl(item.material)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline"
                >
                  📍 Find Centers
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="text-center mt-4 text-sm text-base-content/60">
        Total items recycled: {history.length}
      </div>
    </div>
  )
}

export default HistoryTable 