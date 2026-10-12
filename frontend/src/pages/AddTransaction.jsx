
import { useState } from 'react'

function AddTransaction() {
  const [form, setForm] = useState({
    senderAccount: '',
    receiverAccount: '',
    amount: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setResult(null)

    if (form.senderAccount.trim() === '' ||
        form.receiverAccount.trim() === '') {
      setError('Please enter both sender and receiver accounts.')
      return
    }

    if (form.senderAccount.trim() === form.receiverAccount.trim()) {
      setError('Sender and receiver accounts must be different.')
      return
    }

    if (!Number.isFinite(Number(form.amount)) || Number(form.amount) <= 0) {
      setError('Amount must be greater than zero.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderAccount: form.senderAccount.trim(),
          receiverAccount: form.receiverAccount.trim(),
          amount: Number(form.amount),
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          typeof data === 'string'
            ? data
            : data?.message || 'Failed to create transaction.'
        )
      }

      setResult(data)
      setForm({
        senderAccount: '',
        receiverAccount: '',
        amount: '',
      })
    } catch (err) {
      console.error('Create transaction error:', err)
      setError(err.message || 'Could not connect to the backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-transaction-page">
      <div className="transaction-form-heading">
        <div>
          <h2>New Banking Transaction</h2>
          <p>Enter transaction details for fraud analysis.</p>
        </div>
        <span className="secure-label">Secure Submission</span>
      </div>

      <form className="transaction-form" onSubmit={handleSubmit}>
        <div className="form-section-title">
          <span className="form-step">01</span>
          <div>
            <h3>Transaction Details</h3>
            <p>Provide the sender, receiver and transfer amount.</p>
          </div>
        </div>

        <div className="form-fields">
          <div className="form-field">
            <label htmlFor="senderAccount">Sender Account</label>
            <input
              id="senderAccount"
              name="senderAccount"
              value={form.senderAccount}
              onChange={handleChange}
              placeholder="e.g. ACC1001"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="receiverAccount">Receiver Account</label>
            <input
              id="receiverAccount"
              name="receiverAccount"
              value={form.receiverAccount}
              onChange={handleChange}
              placeholder="e.g. ACC2001"
              required
            />
          </div>

          <div className="form-field amount-field">
            <label htmlFor="amount">Transaction Amount (₹)</label>
            <div className="amount-input">
              <span>₹</span>
              <input
                id="amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                required
              />
            </div>
            <small>Fraud detection will be performed by the backend.</small>
          </div>
        </div>

        {error && (
          <div className="form-message form-error" role="alert">
            {error}
          </div>
        )}

        <button className="submit-transaction" type="submit" disabled={loading}>
          {loading ? 'Analyzing Transaction...' : 'Submit Transaction'}
        </button>
      </form>

      {result && (
        <section className="analysis-result" aria-live="polite">
          <h3>Transaction Analysis Result</h3>

          <div className="result-grid">
            <div>
              <span>Transaction ID</span>
              <strong>{result.id ?? '—'}</strong>
            </div>
            <div>
              <span>Fraud Status</span>
              <strong
                className={
                  result.fraudStatus === 'SUSPICIOUS'
                    ? 'result-suspicious'
                    : 'result-safe'
                }
              >
                {result.fraudStatus ?? 'Not provided'}
              </strong>
            </div>
            <div>
              <span>Risk Score</span>
              <strong>{result.riskScore ?? '—'}</strong>
            </div>
          </div>

          <p className="fraud-reason">
            <strong>Reason: </strong>
            {result.fraudReason || 'No reason provided by the backend.'}
          </p>
        </section>
      )}
    </div>
  )
}

export default AddTransaction
