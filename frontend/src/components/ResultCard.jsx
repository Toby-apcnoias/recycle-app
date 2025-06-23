const ResultCard = ({ result }) => {
  if (!result) return null

  const { material, confidence, coinsEarned } = result

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-success'
    if (confidence >= 0.6) return 'text-warning'
    return 'text-error'
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
    <div className="card bg-base-100 shadow-xl slide-up">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title text-2xl">
            {getMaterialEmoji(material)} {material}
          </h2>
          <div className="badge badge-primary badge-lg">
            +{coinsEarned.toFixed(2)} 🪙
          </div>
        </div>
        
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Confidence</div>
            <div className={`stat-value text-2xl ${getConfidenceColor(confidence)}`}>
              {(confidence * 100).toFixed(1)}%
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Coins Earned</div>
            <div className="stat-value text-2xl text-success">
              {coinsEarned.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="card-actions justify-end">
          <div className="badge badge-outline">Classification Complete</div>
        </div>
      </div>
    </div>
  )
}

export default ResultCard 