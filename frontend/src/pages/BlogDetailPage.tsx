import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, ApiError, BlogResponse } from '../lib/api';
import { useAuth } from '../lib/auth';

export function BlogDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const auth = useAuth();
  const blogId = Number(id);

  const [blog, setBlog] = useState<BlogResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!blogId) return;
    setError(null);
    setLoading(true);
    api.blogs
      .getById(blogId)
      .then(setBlog)
      .catch((err) => setError(err instanceof ApiError ? `Load failed (${err.status})` : 'Load failed'))
      .finally(() => setLoading(false));
  }, [blogId]);

  async function onDelete() {
    if (!blogId) return;
    setDeleting(true);
    setError(null);
    try {
      await api.blogs.remove(blogId);
      nav('/');
    } catch (err) {
      setError(err instanceof ApiError ? `Delete failed (${err.status})` : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  if (!blogId) return <div className="error">Invalid blog id.</div>;

  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="title">{loading ? 'Loading…' : blog?.title || 'Blog'}</h2>
        {blog && (
          <p className="subtle">
            {blog.user.email} · created {new Date(blog.createdAt).toLocaleString()}
          </p>
        )}
      </div>
      <div className="cardBody">
        {error && <div className="error">{error}</div>}
        {blog && (
          <>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>{blog.content}</div>
            <div className="btnRow" style={{ marginTop: 16 }}>
              <Link className="btn" to="/">
                Back to search
              </Link>
              <Link className="btn" to={`/editor/${blog.id}`}>
                Edit
              </Link>
              {auth.isAuthed && (
                <button className="btn btnDanger" onClick={onDelete} disabled={deleting}>
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

