import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../lib/api';
import { useAuth } from '../lib/auth';

export function AccountPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete = confirmText.trim().toUpperCase() === 'DELETE';

  async function onDeleteAccount() {
    if (!canDelete) return;
    setError(null);
    setLoading(true);
    try {
      await api.users.deleteMe();
      auth.logout();
      navigate('/');
    } catch (err) {
      setError(err instanceof ApiError ? `Delete failed (${err.status})` : 'Delete failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="title">Account settings</h2>
        <p className="subtle">
          Signed in as {auth.user?.name || 'User'} ({auth.user?.email || 'your account'}).
        </p>
      </div>
      <div className="cardBody">
        <div className="error" style={{ marginBottom: 12 }}>
          Account deletion is permanent. Your posts and profile will be deleted.
        </div>
        {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}

        <div className="field">
          <div className="label">Type DELETE to confirm</div>
          <input
            className="input"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
          />
        </div>

        <div className="btnRow">
          <button className="btn btnDanger" disabled={!canDelete || loading} onClick={onDeleteAccount}>
            {loading ? 'Deleting account…' : 'Delete account'}
          </button>
        </div>
      </div>
    </div>
  );
}

