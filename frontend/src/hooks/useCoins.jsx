import { createContext, useContext, useState, useEffect } from 'react'

const CoinsContext = createContext()

export const CoinsProvider = ({ children }) => {
  const [coins, setCoins] = useState(0)

  useEffect(() => {
    const savedCoins = localStorage.getItem('coins')
    if (savedCoins) {
      setCoins(parseFloat(savedCoins))
    }
  }, [])

  const changeCoins = (amount) => {
    setCoins(prev => {
      const newAmount = prev + amount
      localStorage.setItem('coins', newAmount.toString())
      return newAmount
    })
  }

  return (
    <CoinsContext.Provider value={{ coins, changeCoins }}>
      {children}
    </CoinsContext.Provider>
  )
}

export const useCoins = () => {
  const context = useContext(CoinsContext)
  if (!context) {
    throw new Error('useCoins must be used within a CoinsProvider')
  }
  return context
} 