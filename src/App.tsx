// Import necessary dependencies from React and components
import { useState } from 'react'
import { CreateBotForm } from './components/CreateBotForm'
import { ActiveBots } from './components/ActiveBots'
import { ModifyBots } from './components/ModifyBots'
import './App.css'

// Main App component that handles the trading bot UI
function App() {
  // State to track IDs of active trading bots
  const [activeBotIds, setActiveBotIds] = useState<string[]>([])
  
  // State to control which tab is currently visible (create new bot or view active bots)
  const [activeTab, setActiveTab] = useState<'create' | 'active' | 'modify'>('create')

  // Handler called when a new bot is created - switches view to active bots tab
  const handleBotCreated = () => {
    setActiveTab('active')
  }

  return (
    <div className="app">
      {/* Header section containing title and navigation */}
      <header>
        <h1>Trading Bot Control Panel</h1>
        <nav>
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
            className={activeTab === 'modify' ? 'active' : 'active'}
            onClick={() => setActiveTab('modify')}
          >
            Modify Bots
          </button>
        </nav>
      </header>

      {/* Main content area */}
      <main>
        {/* Conditionally render components based on active tab */}
        {activeTab === 'create' && <CreateBotForm onBotCreated={handleBotCreated} />}
        {activeTab === 'active' && (
          <ActiveBots
            botIds={activeBotIds}
            onBotsUpdated={() => setActiveBotIds(prevIds => 
              prevIds.filter(id => !document.querySelector(`input[data-bot-id="${id}"]:checked`))
            )}
          />
        )}
        {activeTab === 'modify' && <ModifyBots botIds={activeBotIds} />}
      </main>
    </div>
  )
}

export default App
