import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="notFoundWrap">
      <div className="card notFoundCard">
        <div className="cardBody">
          <div className="code404">404</div>
          <h2 className="title" style={{ fontSize: 28, marginTop: 4 }}>
            Lost in the content universe
          </h2>
          <p className="subtle" style={{ fontSize: 15 }}>
            The page you requested does not exist. The good news: the best stories are still one click away.
          </p>
          <div className="btnRow" style={{ marginTop: 16 }}>
            <Link className="btn btnPrimary" to="/">
              Go home
            </Link>
            <Link className="btn" to="/feed">
              Open feed
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

