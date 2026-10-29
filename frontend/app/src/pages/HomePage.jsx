import { useEffect, useState } from "react";
import { api } from "../api.js";

// Pagina de start: verifica daca backend-ul si baza de date raspund
function HomePage() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getHealth()
      .then((data) => setHealth(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <h1>Aplicatie PW/DAW - Sabau Daniel</h1>
      <p className="subtitle">Frontend React conectat la un backend Symfony</p>

      <section className="card">
        <h2>Starea backend-ului</h2>
        <p>
          Cerere: <code>GET {api.url}/api/health</code>
        </p>

        {!health && !error && <p>Se verifica...</p>}

        {error && (
          <div className="status status-error">
            <strong>Backend-ul nu raspunde.</strong>
            <p>{error}</p>
            <p>
              Porniti backend-ul: din folderul principal al proiectului rulati{" "}
              <code>docker compose -f backend/compose.yaml up -d</code>.
            </p>
          </div>
        )}

        {health && (
          <div className="status status-ok">
            <p>
              <strong>Mesaj:</strong> {health.message}
            </p>
            <p>
              <strong>Baza de date:</strong> {health.database}
            </p>
            <p>
              <strong>Ora serverului:</strong> {health.time}
            </p>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Link-uri utile</h2>
        <ul>
          <li>
            Documentatia API (Swagger):{" "}
            <a href={`${api.url}/api/doc`} target="_blank" rel="noreferrer">
              {api.url}/api/doc
            </a>
          </li>
        </ul>
      </section>
    </>
  );
}

export default HomePage;
