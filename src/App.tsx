// Import necessary dependencies from React and components
import { useState } from 'react'
import { CreateBotForm } from './components/CreateBotForm'
import { ActiveBots } from './components/ActiveBots'
import { Trade } from './components/Trade'
import './App.css'

// Main App component that handles the trading bot UI
function App() {
  // State to track IDs of active trading bots
  const [botIds, setBotIds] = useState<string[]>([])
  
  // State to control which tab is currently visible (create new bot or view active bots)
  const [activeTab, setActiveTab] = useState<'create' | 'active' | 'trade'>('create')

  // Handler called when a new bot is created - switches view to active bots tab
  const handleBotCreated = () => {
    setActiveTab('active')
  }

  const handleBotsUpdated = () => {
    setBotIds([...botIds])
  }

  return (
    <div className="app">
      {/* Header section containing title and navigation */}
      <header>
        <h1>Trading Bot Control Panel</h1>
        <nav className="nav-tabs">
          {/* Navigation buttons to switch between create/active views */}
          <button
            className={activeTab === 'create' ? 'active' : 'active'}
            onClick={() => setActiveTab('create')}
          >
            Create Bot
          </button>
          <button
            className={activeTab === 'active' ? 'active' : 'active'}
            onClick={() => setActiveTab('active')}
          >
            Active Bots
          </button>
          <button
            className={activeTab === 'trade' ? 'active' : 'active'}
            onClick={() => setActiveTab('trade')}
          >
            Trade
          </button>
        </nav>
      </header>

      {/* Main content area */}
      <main className="main-content">
        {/* Conditionally render components based on active tab */}
        {activeTab === 'create' && <CreateBotForm onBotCreated={handleBotCreated} />}
        {activeTab === 'active' && (
          <ActiveBots
            botIds={botIds}
            onBotsUpdated={handleBotsUpdated}
          />
        )}
        {activeTab === 'trade' && (
          <Trade />
        )}
      </main>
    </div>
  )
}

export default App
