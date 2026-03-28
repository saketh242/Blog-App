import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError, BlogResponse } from '../lib/api';

export function FeedPage() {
  const [items, setItems] = useState<BlogResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadFeed() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.blogs.feed(12);
      setItems(res);
    } catch (err) {
      setError(err instanceof ApiError ? `Feed failed (${err.status})` : 'Feed failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadFeed();
  }, []);

  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="title">Feed</h2>
        <p className="subtle">Random blog posts for quick discovery.</p>
      </div>
      <div className="cardBody">
        {error && <div className="error">{error}</div>}
        <div className="btnRow" style={{ marginBottom: 12 }}>
          <button className="btn" onClick={loadFeed} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh feed'}
          </button>
        </div>

        <div className="list">
          {items.map((blog) => (
            <Link key={blog.id} to={`/blogs/${blog.id}`} className="listItem">
              <div style={{ fontWeight: 700 }}>{blog.title}</div>
              <div className="subtle" style={{ marginTop: 6 }}>
                {(blog.content || '').slice(0, 170)}
                {(blog.content || '').length > 170 ? '…' : ''}
              </div>
              <div className="meta">
                <span>{blog.user.name}</span>
                <span>·</span>
                <span>{blog.user.email}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

