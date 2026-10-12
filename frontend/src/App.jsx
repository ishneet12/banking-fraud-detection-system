import Dashboard from './pages/Dashboard'
import AddTransaction from './pages/AddTransaction'
import AllTransactions from './pages/AllTransactions'
import FraudDetection from './pages/FraudDetection'
import FraudAlerts from './pages/FraudAlerts'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const pageTitles = {
    dashboard: 'Dashboard Overview',
    'add-transaction': 'Add Transaction',
    transactions: 'All Transactions',
    'fraud-detection': 'Fraud Detection',
    'fraud-alerts': 'Fraud Alerts',
  }

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="app-main">
        <header className="topbar">
          <div>
            <p className="eyebrow">BANKING FRAUD MONITORING</p>
            <h1>{pageTitles[activePage]}</h1>
          </div>

          <div className="user-profile">
            <div className="user-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <span>System Monitor</span>
            </div>
          </div>
        </header>

        <section className="page-content">
          <div className="page-welcome">
            <span className="welcome-icon">✦</span>
            <div>
              <h2>{pageTitles[activePage]}</h2>
              <p>
                {activePage === 'dashboard'
                  ? 'Monitor banking activity and identify suspicious transactions.'
                  : `Manage ${pageTitles[activePage].toLowerCase()} in FraudShield.`}
              </p>
            </div>
          </div>

          {activePage === 'dashboard' ? (
            <Dashboard />
          ) : activePage === 'add-transaction' ? (
             <AddTransaction />
          ) : activePage === 'transactions' ? (
              <AllTransactions />
          ) :activePage === 'fraud-detection' ? (
               <FraudDetection />
          )  : activePage === 'fraud-alerts' ? (
              <FraudAlerts />
          ) : (
            <div className="placeholder-panel">
              <h3>{pageTitles[activePage]}</h3>
              <p>We will build this page next.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
