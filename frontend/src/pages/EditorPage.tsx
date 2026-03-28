import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, ApiError, BlogRequest, BlogResponse } from '../lib/api';
import { useAuth } from '../lib/auth';
import { TagPicker } from '../components/TagPicker';

export function EditorPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const auth = useAuth();
  const blogId = id ? Number(id) : null;
  const isEdit = Boolean(blogId);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const canSave = useMemo(() => title.trim().length > 0 && content.trim().length > 0, [title, content]);

  useEffect(() => {
    if (!isEdit || !blogId) return;
    setLoading(true);
    setError(null);
    api.blogs
      .getById(blogId)
      .then((b: BlogResponse) => {
        setTitle(b.title);
        setContent(b.content);
      })
      .catch((err) => setError(err instanceof ApiError ? `Load failed (${err.status})` : 'Load failed'))
      .finally(() => setLoading(false));
  }, [isEdit, blogId]);

  async function onSave() {
    if (!auth.isAuthed) {
      nav('/login');
      return;
    }
    if (!canSave) return;

    const req: BlogRequest = { title: title.trim(), content: content.trim(), tags: tags.length ? tags : undefined };
    setSaving(true);
    setError(null);
    try {
      const saved = isEdit && blogId ? await api.blogs.update(blogId, req) : await api.blogs.create(req);
      nav(`/blogs/${saved.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? `Save failed (${err.status})` : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <div className="cardHeader">
          <h2 className="title">{isEdit ? 'Edit post' : 'New post'}</h2>
          <p className="subtle">Saving publishes Kafka events; Elasticsearch stays in sync.</p>
        </div>
        <div className="cardBody">
          {error && <div className="error">{error}</div>}
          {loading ? (
            <div className="subtle">Loading…</div>
          ) : (
            <>
              <div className="field">
                <div className="label">Title</div>
                <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="field">
                <div className="label">Content</div>
                <textarea className="textarea" value={content} onChange={(e) => setContent(e.target.value)} />
              </div>
              <div className="field">
                <div className="label">Tags</div>
                <TagPicker value={tags} onChange={setTags} placeholder="Type to autocomplete…" />
              </div>
              <div className="btnRow">
                <button className="btn btnPrimary" disabled={!canSave || saving} onClick={onSave}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <Link className="btn" to="/">
                  Cancel
                </Link>
              </div>
              {!auth.isAuthed && <div className="hint">You must sign in to create or edit posts.</div>}
            </>
          )}
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h2 className="title">Preview</h2>
          <p className="subtle">What you type is what you’ll publish.</p>
        </div>
        <div className="cardBody">
          <div style={{ fontWeight: 800, fontSize: 18, lineHeight: 1.25 }}>{title || 'Untitled'}</div>
          <div className="meta" style={{ marginTop: 10 }}>
            {(tags || []).slice(0, 6).map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 12, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.86)' }}>
            {content || 'Start writing…'}
          </div>
        </div>
      </div>
    </div>
  );
}

