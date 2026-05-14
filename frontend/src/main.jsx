import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

// Add error boundary to catch and display errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error)
  const root = document.getElementById('root')
  if (root) {
    root.innerHTML = `
      <div style="padding: 40px; font-family: Arial; color: #d32f2f; background: #ffebee; border-radius: 8px; margin: 20px;">
        <h1 style="margin-top: 0;">JavaScript Error Detected</h1>
        <h3>Error Message:</h3>
        <p style="background: white; padding: 10px; border-radius: 4px;">${event.error?.message || event.message || 'Unknown error'}</p>
        <h3>Stack Trace:</h3>
        <pre style="background: white; padding: 10px; border-radius: 4px; overflow: auto; max-height: 400px;">${event.error?.stack || 'No stack trace'}</pre>
        <p><strong>Please screenshot this error and share it.</strong></p>
      </div>
    `
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
