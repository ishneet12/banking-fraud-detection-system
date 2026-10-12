
import { useEffect, useState } from 'react'

function FraudDetection() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/transactions'
        )

        if (!response.ok) {
          throw new Error('Unable to load transaction data.')
        }

        const data = await response.json()
        setTransactions(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || 'Something went wrong.')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const suspiciousTransactions = transactions.filter(
    (transaction) =>
      String(transaction.fraudStatus ?? '').toUpperCase() === 'SUSPICIOUS'
  )

  if (loading) {
    return <div className="fraud-panel">Analyzing transactions...</div>
  }

  if (error) {
    return <div className="fraud-panel fraud-error">{error}</div>
  }

  return (
    <div className="fraud-detection-page">
      <div className="fraud-summary">
        <div className="fraud-summary-card">
          <span>Total Analyzed</span>
          <h2>{transactions.length}</h2>
        </div>

        <div className="fraud-summary-card suspicious-summary">
          <span>Suspicious Transactions</span>
          <h2>{suspiciousTransactions.length}</h2>
        </div>
      </div>

      <div className="fraud-panel">
        <div className="fraud-panel-heading">
          <div>
            <h3>Suspicious Transactions</h3>
            <p>Transactions flagged by your fraud detection rules</p>
          </div>

          <span className="fraud-count">
            {suspiciousTransactions.length} flagged
          </span>
        </div>

        {suspiciousTransactions.length === 0 ? (
          <div className="fraud-empty">
            <span>✓</span>
            <h3>No suspicious transactions found</h3>
            <p>Flagged transactions will appear here when detected.</p>
          </div>
        ) : (
          <div className="fraud-table-wrapper">
            <table className="fraud-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Amount</th>
                  <th>Risk Score</th>
                  <th>Reason</th>
                </tr>
              </thead>

              <tbody>
                {suspiciousTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>#{transaction.id}</td>
                    <td>{transaction.senderAccount}</td>
                    <td>{transaction.receiverAccount}</td>
                    <td>
                      ₹{Number(transaction.amount ?? 0).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className="risk-score">
                        {transaction.riskScore ?? '—'}/100
                      </span>
                    </td>
                    <td>{transaction.fraudReason || 'No reason provided'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default FraudDetection
