import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export function HomePage() {
  const auth = useAuth();

  return (
    <div className="homeWrap">
      <section className="hero card">
        <div className="cardBody">
          <div className="heroBadge">Kafka + Elasticsearch + Spring Boot</div>
          {auth.isAuthed && (
            <p className="subtle" style={{ marginTop: 0, marginBottom: 10 }}>
              Welcome back, {auth.user?.name || 'Creator'}.
            </p>
          )}
          <h1 className="heroTitle">Publish fast. Search instantly. Scale confidently.</h1>
          <p className="heroText">
            Blogapp gives creators a smooth writing workflow and gives readers blazing-fast discovery powered by
            Elasticsearch. Every post event is streamed via Kafka to keep search always in sync.
          </p>
          <div className="btnRow heroActionRow">
            {auth.isAuthed ? (
              <>
                <Link className="btn btnPrimary iconBtn" to="/feed" aria-label="Explore feed" title="Explore feed">
                  <span aria-hidden="true">🌐</span>
                </Link>
                <Link className="btn iconBtn" to="/search" aria-label="Search posts" title="Search posts">
                  <span aria-hidden="true">🔎</span>
                </Link>
                <Link className="btn iconBtn" to="/editor" aria-label="Write a post" title="Write a post">
                  <span aria-hidden="true">✍️</span>
                </Link>
              </>
            ) : (
              <>
                <Link className="btn btnPrimary iconBtn" to="/register" aria-label="Get started" title="Get started">
                  <span aria-hidden="true">🚀</span>
                </Link>
                <Link className="btn iconBtn" to="/login" aria-label="Login" title="Login">
                  <span aria-hidden="true">🔐</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="featureGrid">
        <article className="card">
          <div className="cardBody">
            <h3 className="title">Real-time search sync</h3>
            <p className="subtle">
              Create, update, and delete flows publish Kafka events so Elasticsearch indexes reflect content changes
              quickly.
            </p>
          </div>
        </article>
        <article className="card">
          <div className="cardBody">
            <h3 className="title">Tag autocomplete</h3>
            <p className="subtle">
              Smarter writing experience with tag suggestions, consistent taxonomy, and cleaner discoverability.
            </p>
          </div>
        </article>
        <article className="card">
          <div className="cardBody">
            <h3 className="title">Secure author workflows</h3>
            <p className="subtle">
              JWT-protected actions keep editing, publishing, and personalized features available only to authenticated
              users.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}

