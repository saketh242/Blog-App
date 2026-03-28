import { useEffect, useMemo, useRef, useState } from 'react';
import { api, TagResponse } from '../lib/api';
import type { KeyboardEvent } from 'react';

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
};

function uniq(arr: string[]) {
  return Array.from(new Set(arr.map((t) => t.trim()).filter(Boolean)));
}

export function TagPicker({ value, onChange, placeholder }: Props) {
  const [q, setQ] = useState('');
  const [suggestions, setSuggestions] = useState<TagResponse[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debRef = useRef<number | null>(null);

  const normalized = useMemo(() => uniq(value), [value]);

  useEffect(() => {
    const query = q.trim();
    if (!query) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    if (debRef.current) window.clearTimeout(debRef.current);
    debRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.tags.suggest(query);
        setSuggestions(res);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 200);
  }, [q]);

  function addTag(name: string) {
    const next = uniq([...normalized, name]);
    onChange(next);
    setQ('');
    setOpen(false);
  }

  function removeTag(name: string) {
    onChange(normalized.filter((t) => t !== name));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const name = q.trim();
      if (name) addTag(name);
    }
    if (e.key === 'Escape') setOpen(false);
  }

  return (
    <div>
      <div className="btnRow" style={{ marginBottom: 10 }}>
        {normalized.map((t) => (
          <span key={t} className="tag tagButton" onClick={() => removeTag(t)} title="Click to remove">
            {t}
          </span>
        ))}
      </div>

      <div className="suggestWrap">
        <input
          className="input"
          value={q}
          placeholder={placeholder || 'Add a tag and press Enter'}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
        />
        {open && (suggestions.length > 0 || loading) && (
          <div className="suggestList">
            {loading ? (
              <div className="suggestItem">
                <span>Searching…</span>
                <span className="kbd">ES not needed</span>
              </div>
            ) : (
              suggestions.map((s) => (
                <div key={s.id} className="suggestItem" onMouseDown={() => addTag(s.name)}>
                  <span>{s.name}</span>
                  <span className="kbd">add</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <div className="hint">Tip: press Enter to add a custom tag.</div>
    </div>
  );
}

