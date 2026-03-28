import { clearToken, getToken } from './storage';

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(path, { ...init, headers });
  const text = await res.text();
  const body = text ? safeJson(text) : null;

  if (res.status === 401) {
    clearToken();
  }

  if (!res.ok) {
    throw new ApiError((body as any)?.message || res.statusText, res.status, body);
  }
  return body as T;
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export type AuthResponse = { token: string };
export type UserProfile = { id: number; email: string; name: string };

export type BlogRequest = { title: string; content: string; tags?: string[] };

export type BlogResponse = {
  id: number;
  title: string;
  content: string;
  user: { id: number; email: string; name: string };
  createdAt: string;
  updatedAt: string;
};

export type TagResponse = { id: number; name: string };

export type BlogSearchItem = {
  id: number;
  title: string;
  content: string;
  userEmail: string;
  tags: string[];
};

export type BlogSearchResponse = {
  total: number;
  page: number;
  size: number;
  items: BlogSearchItem[];
};

export const api = {
  auth: {
    register: (email: string, password: string, name: string) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) }),
    login: (email: string, password: string) =>
      request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  },
  blogs: {
    create: (req: BlogRequest) =>
      request<BlogResponse>('/api/blogs', { method: 'POST', body: JSON.stringify(req) }),
    getById: (id: number) => request<BlogResponse>(`/api/blogs/${id}`),
    update: (id: number, req: BlogRequest) =>
      request<BlogResponse>(`/api/blogs/${id}`, { method: 'PUT', body: JSON.stringify(req) }),
    remove: (id: number) => request<void>(`/api/blogs/${id}`, { method: 'DELETE' }),
    feed: (size = 10) => request<BlogResponse[]>(`/api/blogs/feed?size=${size}`),
  },
  users: {
    me: () => request<UserProfile>('/api/users/me'),
    deleteMe: () => request<void>('/api/users/me', { method: 'DELETE' }),
  },
  tags: {
    list: () => request<TagResponse[]>('/api/tags'),
    suggest: (q: string) => request<TagResponse[]>(`/api/tags/suggest?q=${encodeURIComponent(q)}`),
  },
  search: {
    blogs: (params: { q?: string; userEmail?: string; tags?: string[]; page?: number; size?: number }) => {
      const usp = new URLSearchParams();
      if (params.q) usp.set('q', params.q);
      if (params.userEmail) usp.set('userEmail', params.userEmail);
      (params.tags || []).forEach((t) => usp.append('tags', t));
      usp.set('page', String(params.page ?? 0));
      usp.set('size', String(params.size ?? 10));
      return request<BlogSearchResponse>(`/api/search/blogs?${usp.toString()}`);
    },
  },
};

