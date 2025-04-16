function Approvals() {
  // ...existing state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApprovals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/approvals/`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setApprovalList(data);
    } catch (error) {
      setError('Error fetching approvals: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="approvals-container">
      {/* ...existing header */}
      <div className="content">
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading">Loading...</div>}
        {/* ...rest of your component JSX */}
      </div>
    </div>
  );
}