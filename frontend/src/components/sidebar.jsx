
function Sidebar({ activePage, onNavigate }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '▦' },
    { id: 'add-transaction', label: 'Add Transaction', icon: '+' },
    { id: 'transactions', label: 'All Transactions', icon: '⇄' },
    { id: 'fraud-detection', label: 'Fraud Detection', icon: '⚠' },
    { id: 'fraud-alerts', label: 'Fraud Alerts', icon: '♧' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">S</div>
        <div>
          <h2>FraudShield</h2>
          <span>SECURITY MONITOR</span>
        </div>
      </div>

      <p className="sidebar-section-title">WORKSPACE</p>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${
              activePage === item.id ? 'nav-item-active' : ''
            }`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="online-dot" />
        Fraud monitoring active
      </div>
    </aside>
  )
}

export default Sidebar
