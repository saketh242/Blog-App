import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './styles.css';
import { useAuth } from './lib/auth';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SearchPage } from './pages/SearchPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { EditorPage } from './pages/EditorPage';
import { FeedPage } from './pages/FeedPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AccountPage } from './pages/AccountPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const loc = useLocation();
  if (!auth.isAuthed) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return <>{children}</>;
}

export default function App() {
  const auth = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    auth.logout();
    navigate('/');
  }

  return (
    <div className="appShell">
      <div className="topBar">
        <div className="topBarInner">
          <Link className="brand" to="/">
            <span className="brandMark" />
            <span>Blogapp</span>
          </Link>
          <div className="userTag">{auth.isAuthed ? auth.user?.name || auth.user?.email || 'User' : 'Guest'}</div>
        </div>
      </div>

      <div className="shellBody">
        <aside className="sidebar card">
          <div className="cardBody">
            <div className="sideNav">
              <Link className="pill sideRailItem" to="/" aria-label="Home" title="Home">
                <span aria-hidden="true">🏠</span>
              </Link>
              <Link className="pill sideRailItem" to="/search" aria-label="Search" title="Search">
                <span aria-hidden="true">🔎</span>
              </Link>
              {auth.isAuthed && (
                <>
                  <Link className="pill sideRailItem" to="/feed" aria-label="Feed" title="Feed">
                    <span aria-hidden="true">📰</span>
                  </Link>
                  <Link className="pill sideRailItem" to="/editor" aria-label="New post" title="New post">
                    <span aria-hidden="true">✍️</span>
                  </Link>
                  <Link className="pill sideRailItem" to="/account" aria-label="Account" title="Account">
                    <span aria-hidden="true">👤</span>
                  </Link>
                  <button className="pill pillDanger sideBtn sideRailItem" onClick={onLogout} aria-label="Logout" title="Logout">
                    <span aria-hidden="true">🚪</span>
                  </button>
                </>
              )}
              {!auth.isAuthed && (
                <>
                  <Link className="pill sideRailItem" to="/login" aria-label="Login" title="Login">
                    <span aria-hidden="true">🔐</span>
                  </Link>
                  <Link className="pill sideRailItem" to="/register" aria-label="Register" title="Register">
                    <span aria-hidden="true">🚀</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </aside>

        <div className="content">
          <Routes>
            <Route
              path="/feed"
              element={
                <RequireAuth>
                  <FeedPage />
                </RequireAuth>
              }
            />
            <Route
              path="/account"
              element={
                <RequireAuth>
                  <AccountPage />
                </RequireAuth>
              }
            />
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/blogs/:id"
              element={
                <RequireAuth>
                  <BlogDetailPage />
                </RequireAuth>
              }
            />
            <Route
              path="/editor"
              element={
                <RequireAuth>
                  <EditorPage />
                </RequireAuth>
              }
            />
            <Route
              path="/editor/:id"
              element={
                <RequireAuth>
                  <EditorPage />
                </RequireAuth>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
