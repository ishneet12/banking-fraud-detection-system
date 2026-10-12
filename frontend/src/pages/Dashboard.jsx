
import { useEffect, useState } from 'react'

function Dashboard() {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    suspiciousTransactions: 0,
    openAlerts: 0,
    closedAlerts: 0,
  })

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsResponse, transactionsResponse] = await Promise.all([
          fetch('http://localhost:8080/api/fraud-dashboard'),
          fetch('http://localhost:8080/api/transactions'),
        ])

        if (!statsResponse.ok || !transactionsResponse.ok) {
          throw new Error('Could not fetch dashboard data')
        }

        const statsData = await statsResponse.json()
        const transactionsData = await transactionsResponse.json()

        setStats(statsData)
        setTransactions(transactionsData)
      } catch (err) {
        console.error(err)
        setError('Unable to load dashboard data. Check your backend.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const cards = [
    {
      label: 'Total Transactions',
      value: stats.totalTransactions,
      color: 'blue',
    },
    {
      label: 'Suspicious Transactions',
      value: stats.suspiciousTransactions,
      color: 'red',
    },
    {
      label: 'Open Alerts',
      value: stats.openAlerts,
      color: 'orange',
    },
    {
      label: 'Closed Alerts',
      value: stats.closedAlerts,
      color: 'green',
    },
  ]

  return (
    <div className="dashboard-page">
      <div className="dashboard-intro">
        <div>
          <h2>Security Overview</h2>
          <p>Here's what's happening across your banking transactions.</p>
        </div>
        <span className="live-indicator">● Live API</span>
      </div>

      {loading && <p>Loading dashboard data...</p>}
      {error && <p className="dashboard-error">{error}</p>}

      <div className="stats-grid">
        {cards.map((card) => (
          <div className="stat-card" key={card.label}>
            <span className={`stat-accent ${card.color}`} />
            <p>{card.label}</p>
            <h3>{loading ? '—' : card.value ?? 0}</h3>
          </div>
        ))}
      </div>

      <section className="recent-section">
        <div className="section-heading">
          <div>
            <h2>Recent Transactions</h2>
            <p>Latest records from your transaction database.</p>
          </div>
          <span className="record-count">
            {transactions.length} records
          </span>
        </div>

        {!loading && !error && (
          <div className="table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Amount</th>
                  <th>Risk Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((transaction) => (
                  <tr key={transaction.id}>
                    <td>#{transaction.id}</td>
                    <td>{transaction.senderAccount}</td>
                    <td>{transaction.receiverAccount}</td>
                    <td>
                      ₹{Number(transaction.amount).toLocaleString('en-IN')}
                    </td>
                    <td>{transaction.riskScore ?? '—'}</td>
                    <td>
                      <span
                        className={`transaction-status ${
                          transaction.fraudStatus === 'SUSPICIOUS'
                            ? 'status-suspicious'
                            : 'status-low-risk'
                        }`}
                      >
                        {transaction.fraudStatus ?? 'UNKNOWN'}
                      </span>
                    </td>
                  </tr>
                ))}

                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="6">No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard
