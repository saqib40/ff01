import React from 'react'
import ReactDOM from 'react-dom/client'
import Popup from './Popup' // <--- Make sure this imports Popup

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
)