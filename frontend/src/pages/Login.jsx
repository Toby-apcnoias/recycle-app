import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

const Login = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/recycle')
      }
    })

    return () => unsubscribe()
  }, [navigate])

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Sign in failed:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <div className="text-6xl mb-6">♻️</div>
          <h1 className="text-3xl font-bold mb-2">RecycleApp</h1>
          <p className="text-base-content/60 mb-6">
            AI-powered recycling classification
          </p>
          
          <div className="space-y-4">
            <button 
              className="btn btn-primary btn-block"
              onClick={handleGoogleSignIn}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
            
            <div className="divider">Features</div>
            
            <div className="grid grid-cols-1 gap-2 text-sm text-base-content/60">
              <div className="flex items-center gap-2">
                <span>📸</span> AI Image Classification
              </div>
              <div className="flex items-center gap-2">
                <span>🪙</span> Earn Coins for Recycling
              </div>
              <div className="flex items-center gap-2">
                <span>📋</span> Track Your Progress
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span> Find Recycling Centers
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 