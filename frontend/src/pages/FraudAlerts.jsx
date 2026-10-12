
import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:8080/api/fraud-alert'

function FraudAlerts() {
  const [alerts, setAlerts] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  // Fetch all fraud alerts from the backend
  const fetchAlerts = async () => {
    try {
      setError('')

      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error(`Failed to fetch alerts (${response.status})`)
      }

      const data = await response.json()
      setAlerts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Unable to load fraud alerts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  // Update an alert's status in the backend

const updateStatus = async (alertId, newStatus) => {
  try {
    setUpdatingId(alertId)
    setError('')

    console.log('Updating alert ID:', alertId)
    console.log('New status:', newStatus)

    const response = await fetch(
      `http://localhost:8080/api/fraud-alert/${alertId}/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      }
    )

    const responseText = await response.text()

    console.log('HTTP status:', response.status)
    console.log('Backend response:', responseText)

    if (!response.ok) {
      throw new Error(
        `Update failed (${response.status}): ${responseText}`
      )
    }

    // Refresh the alerts after a successful update.
    await fetchAlerts()
  } catch (err) {
    console.error('Alert update error:', err)
    setError(err.message || 'Unable to update alert status.')
  } finally {
    setUpdatingId(null)
  }
}

  const filteredAlerts = alerts.filter((alert) => {
    return (
      filter === 'ALL' ||
      String(alert.status ?? '').toUpperCase() === filter
    )
  })

  const countByStatus = (status) =>
    alerts.filter(
      (alert) =>
        String(alert.status ?? '').toUpperCase() === status
    ).length

  if (loading) {
    return <div className="alerts-panel">Loading fraud alerts...</div>
  }

  return (
    <div className="alerts-page">
      {/* Summary cards */}
      <div className="alerts-summary">
        <div className="alerts-summary-card">
          <span>Total Alerts</span>
          <h2>{alerts.length}</h2>
        </div>

        <div className="alerts-summary-card">
          <span>Open</span>
          <h2>{countByStatus('OPEN')}</h2>
        </div>

        <div className="alerts-summary-card">
          <span>Under Review</span>
          <h2>{countByStatus('UNDER_REVIEW')}</h2>
        </div>

        <div className="alerts-summary-card">
          <span>Closed</span>
          <h2>{countByStatus('CLOSED')}</h2>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="alerts-error">
          {error}
        </div>
      )}

      {/* Alerts table */}
      <div className="alerts-panel">
        <div className="alerts-heading">
          <div>
            <h3>Fraud Alert Records</h3>
            <p>Review suspicious transactions and manage alert statuses.</p>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="ALL">All Alerts</option>
            <option value="OPEN">Open</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="alerts-empty">
            No fraud alerts found.
          </div>
        ) : (
          <div className="alerts-table-wrapper">
            <table className="alerts-table">
              <thead>
                <tr>
                  <th>Alert ID</th>
                  <th>Transaction ID</th>
                  <th>Risk Score</th>
                  <th>Reason</th>
                  <th>Created At</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredAlerts.map((alert) => {
                  const status = String(
                    alert.status ?? ''
                  ).toUpperCase()

                  return (
                    <tr key={alert.id}>
                      <td>#{alert.id}</td>

                      <td>#{alert.transactionId}</td>

                      <td>{alert.riskScore ?? '—'}/100</td>

                      <td>
                        {alert.reason || 'No reason provided'}
                      </td>

                      <td>
                        {alert.createdAt
                          ? new Date(alert.createdAt).toLocaleString()
                          : '—'}
                      </td>

                      <td>
                        <span
                          className={`alert-status status-${status.toLowerCase()}`}
                        >
                          {status || 'UNKNOWN'}
                        </span>
                      </td>

                      <td>
                        <select
                          value={status}
                          disabled={updatingId === alert.id}
                          onChange={(event) =>
                            updateStatus(
                              alert.id,
                              event.target.value
                            )
                          }
                        >
                          <option value="OPEN">Open</option>
                          <option value="UNDER_REVIEW">
                            Under Review
                          </option>
                          <option value="CLOSED">Closed</option>
                        </select>

                        {updatingId === alert.id && (
                          <span className="updating-text">
                            Saving...
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default FraudAlerts

