import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState('Carregando...')

  useEffect(() => {
    setStatus('PSQ - Pedro Study Quest funcionando!')
  }, [])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '2rem',
      fontWeight: 'bold',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
        <div>{status}</div>
        <div style={{ fontSize: '1rem', marginTop: '1rem', opacity: 0.8 }}>
          Se você está vendo isso, o app está funcionando!
        </div>
        <button 
          onClick={() => alert('Botão funcionando!')}
          style={{
            marginTop: '2rem',
            padding: '1rem 2rem',
            fontSize: '1rem',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Testar Botão
        </button>
      </div>
    </div>
  )
}

export default App
