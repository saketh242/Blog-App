import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../lib/api';
import { useAuth } from '../lib/auth';

export function RegisterPage() {
  const nav = useNavigate();
  const auth = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.auth.register(email.trim(), password, name.trim());
      await auth.login(email.trim(), password);
      nav('/feed');
    } catch (err) {
      setError(err instanceof ApiError ? `Register failed (${err.status})` : 'Register failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="title">Create account</h2>
        <p className="subtle">You’ll be signed in automatically after registering.</p>
      </div>
      <div className="cardBody">
        {error && <div className="error">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="row">
            <div className="field">
              <div className="label">Name</div>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <div className="label">Email</div>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <div className="label">Password</div>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="btnRow">
            <button className="btn btnPrimary" disabled={loading} type="submit">
              {loading ? 'Creating…' : 'Create account'}
            </button>
            <Link className="btn" to="/login">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

