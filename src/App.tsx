import React from 'react'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          lava-e-leva
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Projeto criado automaticamente com Vite + React + TypeScript + Supabase + Vercel
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Frontend</h3>
            <p className="text-blue-600">Vite + React + TypeScript</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Backend</h3>
            <p className="text-green-600">Supabase</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">Deploy</h3>
            <p className="text-purple-600">Vercel</p>
          </div>
        </div>
      </header>
    </div>
  )
}

export default App
