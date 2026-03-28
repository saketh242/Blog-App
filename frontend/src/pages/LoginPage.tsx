import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../lib/api';
import { useAuth } from '../lib/auth';

export function LoginPage() {
  const nav = useNavigate();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await auth.login(email.trim(), password);
      nav('/feed');
    } catch (err) {
      setError(err instanceof ApiError ? `Login failed (${err.status})` : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="title">Sign in</h2>
        <p className="subtle">Use the same credentials you created in register.</p>
      </div>
      <div className="cardBody">
        {error && <div className="error">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="field">
            <div className="label">Email</div>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
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
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
            <Link className="btn" to="/register">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

