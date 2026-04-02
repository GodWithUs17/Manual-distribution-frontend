import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../src/App' // This imports the file we just made
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)