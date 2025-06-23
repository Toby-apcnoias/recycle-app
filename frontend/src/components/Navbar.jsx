import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useCoins } from '../hooks/useCoins.jsx'

const Navbar = ({ user }) => {
  const [theme, setTheme] = useState('light')
  const { coins } = useCoins()
  const location = useLocation()

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  return (
    <div className="navbar bg-base-200 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/recycle">Recycle</Link></li>
            <li><Link to="/history">History</Link></li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">♻️ RecycleApp</Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/recycle" className={location.pathname === '/recycle' || location.pathname === '/' ? 'active' : ''}>Recycle</Link></li>
          <li><Link to="/history" className={location.pathname === '/history' ? 'active' : ''}>History</Link></li>
        </ul>
      </div>
      
      <div className="navbar-end gap-2">
        <div className="badge badge-success gap-1">
          <span>🪙</span>
          <span>{coins.toFixed(2)}</span>
        </div>
        
        <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-8 rounded-full">
              <img 
                alt="User avatar" 
                src={user?.photoURL || 'https://via.placeholder.com/40'} 
              />
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li className="menu-title">
              <span>Hi, {user?.displayName || 'User'}! 👋</span>
            </li>
            <li><button onClick={handleSignOut}>Sign Out</button></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar 