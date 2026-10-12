
import { useEffect, useState } from 'react'

function AllTransactions() {
  const [transactions, setTransactions] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/transactions'
        )

        if (!response.ok) {
          throw new Error('Unable to fetch transactions.')
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

  const filteredTransactions = transactions.filter((transaction) => {
    const searchText = search.trim().toLowerCase()

    // If the search input is a number, match the exact transaction ID.
    const isSearchingById =
      searchText !== '' && /^\d+$/.test(searchText)

    const matchesSearch = isSearchingById
      ? String(transaction.id) === searchText
      : searchText === '' ||
        String(transaction.senderAccount ?? '').toLowerCase().includes(searchText) ||
        String(transaction.receiverAccount ?? '').toLowerCase().includes(searchText)

    const status = String(transaction.fraudStatus ?? '').toUpperCase()

    const matchesFilter =
      filter === 'ALL' ||
      (filter === 'SUSPICIOUS' && status === 'SUSPICIOUS') ||
      (filter === 'LOW_RISK' && status === 'LOW_RISK')

    // Exact ID search should return the matching transaction regardless
    // of the currently selected status filter.
    return matchesSearch && (isSearchingById || matchesFilter)
  })

  if (loading) {
    return <div className="transactions-panel">Loading transactions...</div>
  }

  if (error) {
    return (
      <div className="transactions-panel error-message">
        {error}
      </div>
    )
  }

  return (

    <div className="transactions-page">
      <div className="transactions-toolbar">
        <input
          type="text"
          placeholder="Search ID or account..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="ALL">All Transactions</option>
          <option value="SUSPICIOUS">Suspicious</option>
          <option value="LOW_RISK">Low Risk</option>
        </select>

        <button
          type="button"
          className="refresh-button"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>

      <div className="transactions-panel">
        <div className="transactions-panel-heading">
          <div>
            <h3>Transaction Records</h3>
            <p>Transactions retrieved from your database</p>
          </div>
          <span className="transaction-count">
            {filteredTransactions.length} records
          </span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="empty-transactions">
            No transactions match your search or filter.
          </div>
        ) : (
          <div className="transactions-table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Amount</th>
                  <th>Risk Score</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((transaction) => {
                  const status = String(
                    transaction.fraudStatus ?? ''
                  ).toUpperCase()

                  return (
                    <tr key={transaction.id}>
                      <td>#{transaction.id}</td>
                      <td>{transaction.senderAccount}</td>
                      <td>{transaction.receiverAccount}</td>
                      <td>
                        ₹{Number(transaction.amount ?? 0).toLocaleString('en-IN')}
                      </td>
                      <td>{transaction.riskScore ?? '—'}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            status === 'SUSPICIOUS'
                              ? 'status-suspicious'
                              : 'status-low-risk'
                          }`}
                        >
                          {transaction.fraudStatus ?? 'UNKNOWN'}
                        </span>
                      </td>
                      <td>
                        {transaction.timestamp
                          ? new Date(transaction.timestamp).toLocaleString()
                          : '—'}
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

export default AllTransactions
