import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RecoilRoot } from 'recoil'
import React from 'react'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
      <Toaster position="top-right" toastOptions={{
        style: {
          border: "1px solid #505050",
          background: "#000000",
          color: "#ffffff",
        },
      }}
      />
    </RecoilRoot>
  </React.StrictMode>
)
