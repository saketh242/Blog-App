import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, ApiError, BlogSearchItem } from '../lib/api';
import { TagPicker } from '../components/TagPicker';
import { useAuth } from '../lib/auth';

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export function SearchPage() {
  const auth = useAuth();
  const [sp, setSp] = useSearchParams();
  const [q, setQ] = useState(sp.get('q') ?? '');
  const [userEmail, setUserEmail] = useState(sp.get('userEmail') ?? '');
  const [tags, setTags] = useState<string[]>(sp.getAll('tags'));
  const [page, setPage] = useState<number>(Number(sp.get('page') ?? 0) || 0);
  const [size, setSize] = useState<number>(Number(sp.get('size') ?? 10) || 10);

  const [items, setItems] = useState<BlogSearchItem[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / size)), [total, size]);

  async function runSearch(nextPage?: number) {
    const p = nextPage ?? page;
    setError(null);
    setLoading(true);
    try {
      const res = await api.search.blogs({
        q: q.trim() || undefined,
        userEmail: userEmail.trim() || undefined,
        tags: tags.length ? tags : undefined,
        page: p,
        size,
      });
      setItems(res.items);
      setTotal(res.total);
      setPage(res.page);
      setSize(res.size);

      const next = new URLSearchParams();
      if (q.trim()) next.set('q', q.trim());
      if (userEmail.trim()) next.set('userEmail', userEmail.trim());
      tags.forEach((t) => next.append('tags', t));
      next.set('page', String(res.page));
      next.set('size', String(res.size));
      setSp(next, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? `Search failed (${err.status})` : 'Search failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!auth.isAuthed) {
      return;
    }
    // Initial load (or back/forward navigation)
    runSearch(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAuthed]);

  if (!auth.isAuthed) {
    return (
      <div className="card">
        <div className="cardHeader">
          <h2 className="title">Search</h2>
          <p className="subtle">Sign in to search blog posts.</p>
        </div>
        <div className="cardBody">
          <div className="btnRow">
            <Link className="btn btnPrimary" to="/login">
              Login
            </Link>
            <Link className="btn" to="/register">
              Register
            </Link>
            <Link className="btn" to="/">
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid">
      <div className="card">
        <div className="cardHeader">
          <h2 className="title">Search</h2>
          <p className="subtle">
            Results come from Elasticsearch via <code>/api/search/blogs</code>.
          </p>
        </div>
        <div className="cardBody">
          {error && <div className="error">{error}</div>}

          <div className="searchSlimWrap">
            <div className="searchSlimInput">
              <span className="searchIcon">#</span>
              <input
                className="searchSlimField"
                value={q}
                placeholder="Search posts..."
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="searchSlimInput">
              <span className="searchIcon">@</span>
              <input
                className="searchSlimField"
                value={userEmail}
                placeholder="Filter by author email"
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <div className="label">Tags (optional)</div>
            <TagPicker value={tags} onChange={setTags} placeholder="Type to autocomplete tags…" />
          </div>

          <div className="row">
            <div className="field">
              <div className="label">Page size</div>
              <input
                className="input"
                type="number"
                min={1}
                max={50}
                value={size}
                onChange={(e) => setSize(clamp(Number(e.target.value || 10), 1, 50))}
              />
            </div>
            <div className="field">
              <div className="label">Actions</div>
              <div className="btnRow">
                <button className="btn btnPrimary" disabled={loading} onClick={() => runSearch(0)}>
                  {loading ? 'Searching…' : 'Search'}
                </button>
                <Link className="btn" to="/editor">
                  New post
                </Link>
                <Link className="btn" to="/">
                  Home
                </Link>
              </div>
            </div>
          </div>

          <div className="hint">
            Showing {items.length} of {total} results.
          </div>

          <div className="list" style={{ marginTop: 14 }}>
            {items.map((it) => (
              <Link key={it.id} to={`/blogs/${it.id}`} className="listItem">
                <div style={{ fontWeight: 700 }}>{it.title}</div>
                <div className="subtle" style={{ marginTop: 6 }}>
                  {(it.content || '').slice(0, 160)}
                  {(it.content || '').length > 160 ? '…' : ''}
                </div>
                <div className="meta">
                  <span>{it.userEmail}</span>
                  <span>·</span>
                  <span>{(it.tags || []).join(', ') || 'no tags'}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="btnRow" style={{ marginTop: 16 }}>
            <button className="btn" disabled={loading || page <= 0} onClick={() => runSearch(page - 1)}>
              Prev
            </button>
            <span className="pill">
              Page {page + 1} / {totalPages}
            </span>
            <button
              className="btn"
              disabled={loading || page + 1 >= totalPages}
              onClick={() => runSearch(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h2 className="title">Filters</h2>
          <p className="subtle">This is the UI we’ll build on later.</p>
        </div>
        <div className="cardBody">
          <div className="list">
            <div className="listItem">
              <div style={{ fontWeight: 700 }}>Text</div>
              <div className="subtle">Matches title/content (contains).</div>
            </div>
            <div className="listItem">
              <div style={{ fontWeight: 700 }}>Author</div>
              <div className="subtle">Exact match on <code>userEmail</code>.</div>
            </div>
            <div className="listItem">
              <div style={{ fontWeight: 700 }}>Tags</div>
              <div className="subtle">Any of the chosen tags.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

