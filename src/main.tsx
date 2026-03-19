import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { seedCafes, makeMeAdmin } from './api/seedApi'
import { resetFirestore } from './api/firebase'

// 개발 모드 디버깅 도구 노출
if (import.meta.env.DEV) {
  (window as any).dbUtils = {
    seedCafes,
    makeMeAdmin,
    resetFirestore
  };
  console.log('[Dev] Database utilities available at window.dbUtils');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
